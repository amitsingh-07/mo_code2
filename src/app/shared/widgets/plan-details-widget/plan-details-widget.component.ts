import { CurrencyPipe } from '@angular/common';
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

import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'app-plan-details-widget',
  templateUrl: './plan-details-widget.component.html',
  styleUrls: ['./plan-details-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanDetailsWidgetComponent implements DoCheck, OnInit, AfterViewChecked {
  @Input() data;
  @Input() type;
  @Input() bestValue;
  @Input() isDirect;

  icon;
  insurerLogo;
  premiumAmount;
  productName;
  highlights = [];
  temp;
  isSelected = false;
  canShowRanking = true;
  canShowRating = true;
  canShowDiscount = true;
  isRankContainerSet = false;
  coverageDuration;
  premiumDuration;
  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();

  constructor(
    private currency: CurrencyPipe, private translate: TranslateService,
    private elRef: ElementRef, private renderer: Renderer2) {
    this.translate.use('en');
    this.highlights = [];
  }

  ngDoCheck() {
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
    this.view.emit(this.temp);
  }
  brochureDownload() {
    this.Brochure(this.temp.brochureLink, 'Brochure.json');
  }
  // tslint:disable-next-line:member-ordering
  Brochure = (() => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    return ((link, fileName) => {
      a.href = link;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(link);
    });
  })();

  selectPlan() {
    this.isSelected = !this.isSelected;
    this.select.emit({ plan: this.temp, selected: this.isSelected });
  }

}
