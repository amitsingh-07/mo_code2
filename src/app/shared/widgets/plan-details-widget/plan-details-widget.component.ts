import { CurrencyPipe } from '@angular/common';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'app-plan-details-widget',
  templateUrl: './plan-details-widget.component.html',
  styleUrls: ['./plan-details-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanDetailsWidgetComponent implements DoCheck, OnInit {
  @Input() data;
  @Input() type;
  @Input() bestValue;

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

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();

  constructor(private currency: CurrencyPipe, private translate: TranslateService) {
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

  viewDetails() {
    this.view.emit(this.temp);
  }
  brochureDownload() {
    this.Brochure(this.temp, 'Brochure.json');
  }
  // tslint:disable-next-line:member-ordering
  Brochure = (() => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    return ((data, fileName) => {
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  })();

  selectPlan() {
    this.isSelected = !this.isSelected;
    this.select.emit({ plan: this.temp, selected: this.isSelected });
  }

}