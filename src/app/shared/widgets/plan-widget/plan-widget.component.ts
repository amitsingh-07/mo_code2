import { CurrencyPipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../modal/error-modal/error-modal.component';
import { RecommendationsModalComponent } from '../../modal/recommendations-modal/recommendations-modal.component';
import { ProductDetailComponent } from './../../components/product-detail/product-detail.component';

@Component({
  selector: 'app-plan-widget',
  templateUrl: './plan-widget.component.html',
  styleUrls: ['./plan-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanWidgetComponent implements DoCheck, OnInit, AfterViewChecked {
  @Input() data;
  @Input() type;
  @Input() comparePlan;
  @Input() bestValue;
  @Input() planSelected;

  icon;
  insurerLogo;
  premiumAmount;
  productName;
  highlights = [];
  temp;
  isSelected = false;
  isComparePlanSelected = false;
  canShowRanking = true;
  canShowRating = true;
  canShowDiscount = true;
  isComparePlanEnabled = false;
  isRankContainerSet = false;
  mobileThreshold = 576;

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() compare = new EventEmitter();

  constructor(
    private currency: CurrencyPipe, public modal: NgbModal, private elRef: ElementRef,
    private renderer: Renderer2, private translate: TranslateService) {
    this.highlights = [];
    this.translate.use('en');
  }

  ngDoCheck() {
    this.isComparePlanEnabled = this.comparePlan;
  }

  ngOnInit() {
    if (this.data) {
      this.icon = this.data.icon;
      this.insurerLogo = 'assets/images/' + this.data.insurer.logoName;
      this.premiumAmount = this.data.premium.premiumAmount;
      this.productName = this.data.productName;
      this.coverageDuration = this.data.coverageDuration;
      this.premiumDuration = this.data.premiumDuration;
      this.temp = this.data;
      this.type = this.type.toLowerCase();

      this.highlights.push({ title: 'Coverage Duration:', description: this.data.coverageDuration });
      this.highlights.push({ title: 'Premium Duration:', description: this.data.premiumDuration });
      if (this.type === 'long term care') {
        this.canShowDiscount = false;
        this.highlights.push({ title: 'No. of ADLs:', description: '3 out of 6' });
      }
      if (this.type === 'hospital plan') {
        this.canShowDiscount = false;
        this.highlights.push({ title: 'Rider:', description: 'Covers co-insurance and deductible' });
      }
      if (this.type === 'occupational disability') {
        this.canShowRanking = true;
        this.highlights.push({ title: 'Deferred Period:', description: '6 Months' });
        this.highlights.push({ title: 'Escalating Benefit:', description: '3%' });
      }
      this.highlights.push({ title: 'Needs Medical Underwriting:', description: this.data.underWritting });
    }
  }

  ngAfterViewChecked() {
    if (!this.isRankContainerSet) {
      const rankContainer = this.elRef.nativeElement.querySelectorAll('.insurance-plan-widget__container__rank-box');
      if (rankContainer.length > 0) {
        rankContainer.forEach((el) => {
          if (rankContainer.length === 1) {
            this.renderer.addClass(el, 'one-plan-width');
          } else if (rankContainer.length === 2) {
            this.renderer.addClass(el, 'two-plan-width');
          } else {
            this.renderer.addClass(el, 'three-plan-width');
          }
        });
        this.isRankContainerSet = true;
      }
    }
  }

  viewDetails() {
    // tslint:disable-next-line:no-commented-code
    // this.view.emit(this.temp);
    const data = this.temp;
    const ref = this.modal.open(ProductDetailComponent, { centered: true });
    ref.componentInstance.plan = data;
    ref.componentInstance.protectionType = this.type;
    ref.componentInstance.bestValue = this.bestValue;
    ref.result.then((plan) => {
      if (plan) {
        this.isSelected = true;
        this.select.emit({ plan: this.temp, selected: this.isSelected });
      }
    }).catch((e) => {
    });
  }

  selectPlan() {
    this.isSelected = !this.isSelected;
    this.select.emit({ plan: this.temp, selected: this.isSelected });
  }
  comparePlanErrorForMobileModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Compare 2 Only';
    ref.componentInstance.errorMessage = 'You can only compare a maximum of 2 plans at a time.';
    return false;
  }
  comparePlanErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Compare 4 Only';
    ref.componentInstance.errorMessage = 'You can only compare a maximum of 4 plans at a time.';
  }
  openCommissionModal() {
    const ref = this.modal.open(RecommendationsModalComponent, { centered: true });
    ref.componentInstance.title = this.translate.instant('PROD_INFO_TOOLTIP.COMMISSION.TITLE');
    ref.componentInstance.message = this.translate.instant('PROD_INFO_TOOLTIP.COMMISSION.MESSAGE');
    return false;
  }
  openRatingModal() {
    const ref = this.modal.open(RecommendationsModalComponent, { centered: true });
    ref.componentInstance.title = this.translate.instant('PROD_INFO_TOOLTIP.RATING.TITLE');
    ref.componentInstance.message = this.translate.instant('PROD_INFO_TOOLTIP.RATING.MESSAGE');
  }
  compareplan() {
    if (this.planSelected && this.planSelected.length  < 4) {
      if (window.innerWidth <= this.mobileThreshold) {
        if (this.planSelected.length >= 2) {
          this.comparePlanErrorForMobileModal();
          return false;
        }
      }
      this.isComparePlanSelected = !this.isComparePlanSelected;
    } else {
      if (this.isComparePlanSelected) {
        this.isComparePlanSelected = !this.isComparePlanSelected;
      } else {
        this.comparePlanErrorModal();
        return false;
      }
    }
    this.compare.emit({ plan: this.temp, selected: this.isComparePlanSelected });
  }
}
