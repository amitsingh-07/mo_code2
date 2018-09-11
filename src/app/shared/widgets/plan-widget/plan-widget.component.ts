import { CurrencyPipe } from '@angular/common';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductDetailComponent } from './../../components/product-detail/product-detail.component';

@Component({
  selector: 'app-plan-widget',
  templateUrl: './plan-widget.component.html',
  styleUrls: ['./plan-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanWidgetComponent implements DoCheck, OnInit {
  @Input() data;
  @Input() type;
  @Input() comparePlan;
  @Input() bestValue;

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

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() compare = new EventEmitter();

  constructor(private currency: CurrencyPipe, public modal: NgbModal) {
    this.highlights = [];
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

  viewDetails() {
    //this.view.emit(this.temp);
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
  compareplan() {
    this.isComparePlanSelected = !this.isComparePlanSelected;
    this.compare.emit({ plan: this.temp, selected: this.isComparePlanSelected });
  }
}
