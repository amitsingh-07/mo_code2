import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
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
import { SelectedPlansService } from './../../Services/selected-plans.service';

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
  @Input() comparePlanSelected;
  @Input() isDirect;
  @Input() frequencyType;
  @Input() isViewMode;

  icon;
  insurerLogo;
  premiumAmount;
  premiumAmountYearly;
  premiumFrequency = '';
  productName;
  promoDiscount;
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

  perMonth = '';
  perYear = '';

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() compare = new EventEmitter();

  constructor(
    private currency: CurrencyPipe, public modal: NgbModal, private elRef: ElementRef,
    private renderer: Renderer2, private translate: TranslateService, private titleCasePipe: TitleCasePipe,
    private planService: SelectedPlansService) {
    this.highlights = [];
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((data) => {
      this.perMonth = this.translate.instant('SUFFIX.PER_MONTH');
      this.perYear = this.translate.instant('SUFFIX.PER_YEAR');
    });
  }

  ngDoCheck() {
    this.isComparePlanEnabled = this.comparePlan;
  }

  ngOnInit() {
    if (this.data) {
      this.icon = this.data.icon;
      this.insurerLogo = 'assets/images/' + this.data.insurer.logoName;
      this.premiumAmount = this.data.premium.premiumAmount;
      this.premiumAmountYearly = this.data.premium.premiumAmountYearly;

      if (this.data.promotion && this.data.promotion.promoDiscount) {
        this.promoDiscount = this.data.promotion.promoDiscount;
      }
      this.productName = this.data.productName;
      this.coverageDuration = this.data.premium.durationName;
      this.premiumDuration = this.data.premium.premiumTerm;
      this.temp = this.data;
      this.type = this.type.toLowerCase();

      this.highlights.push(
        { title: 'Coverage Duration:', description: this.titleCasePipe.transform(this.coverageDuration) }
      );
      this.highlights.push({ title: 'Premium Duration:', description: this.premiumDuration });
      if (this.type === 'long-term care') {
        this.frequencyType = 'yearly';
        this.canShowDiscount = false;
        if (this.isDirect) {
          this.highlights.push({ title: 'Payout years:', description: this.data.premium.payoutDuration });
          this.highlights.push({ title: 'Claim Criteria:', description: this.data.premium.claimCriteria });
        } else {
          this.highlights.push({ title: 'No. of ADLs:', description: this.data.premium.numberOfADL });
        }
      }
      if (this.type === 'hospital plan') {
        this.frequencyType = 'yearly';
        this.canShowDiscount = false;
        let riderDesc = '';
        let riderName = this.data.rider.riderName;
        if (riderName && riderName.toLowerCase() === 'full rider') {
          riderName += ':';
          riderDesc = 'Covers Co-Insurance and Deductible';
        } else if (riderName && riderName.toLowerCase() === 'partial rider') {
          riderName += ':';
          riderDesc = 'Covers Co-Insurance';
        } else {
          riderName = 'No Rider';
        }
        this.highlights.push({ title: riderName, description: riderDesc });
      }
      if (this.type === 'occupational disability') {
        this.canShowRanking = true;
        this.highlights.push({ title: 'Deferred Period:', description: this.data.premium.deferredPeriod });
        this.highlights.push({ title: 'Escalating Benefit:', description: this.data.premium.escalatingBenefit });
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
    const ref = this.modal.open(ProductDetailComponent,
      {
        centered: true,
        windowClass: 'product-details-modal-dialog'
      }
    );
    ref.componentInstance.plan = data;
    ref.componentInstance.isViewMode = this.isViewMode;
    ref.componentInstance.isSelected = this.isSelected;
    ref.componentInstance.frequencyType = this.frequencyType;
    ref.componentInstance.protectionType = this.type;
    ref.componentInstance.bestValue = this.bestValue;
    if (this.isDirect) {
      ref.componentInstance.isDirect = true;
    }
    ref.result.then((result) => {
      if (result.plan) {
        this.isSelected = result.selected;
        this.select.emit({ plan: this.temp, selected: this.isSelected });
      }
    }).catch((e) => {
    });
  }

  unselectPlan() {
    this.isComparePlanSelected = false;
    this.isSelected = false;
  }

  selectPlan() {
    this.isSelected = !this.isSelected;
    this.temp.bestValue = this.bestValue;
    this.select.emit({ plan: this.temp, selected: this.isSelected });
  }
  comparePlanErrorForMobileModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('COMPARE_PLANS.ERROR_MODEL_FOR_MOBILE.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('COMPARE_PLANS.ERROR_MODEL_FOR_MOBILE.MESSAGE');
    return false;
  }
  comparePlanErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('COMPARE_PLANS.ERROR_MODEL_FOR_WEB.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('COMPARE_PLANS.ERROR_MODEL_FOR_WEB.MESSAGE');
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

  comparePlans() {
    if (!this.isComparePlanSelected) {
      if (window.innerWidth <= this.mobileThreshold) {
        if (this.comparePlanSelected && this.comparePlanSelected.length >= 2 && !this.isComparePlanSelected) {
          this.comparePlanErrorForMobileModal();
          return false;
        }
      } else {
        if (this.comparePlanSelected && this.comparePlanSelected.length >= 4) {
          this.comparePlanErrorModal();
          return false;
        }
      }
    }
    this.isComparePlanSelected = !this.isComparePlanSelected;
    this.temp.bestValue = this.bestValue;
    this.compare.emit({ plan: this.temp, selected: this.isComparePlanSelected });
  }
}
