import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-plan-widget',
  templateUrl: './plan-widget.component.html',
  styleUrls: ['./plan-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanWidgetComponent implements DoCheck, OnInit {
  @Input() data;
  @Input() type;
  icon;
  premiumAmount;
  productName;
  highlights = [];
  temp;
  insurerRating = 'AA-';
  isSelected = false;
  canShowRanking = true;
  canShowRating = true;
  canShowDiscount = true;

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();

  constructor() {
    this.highlights = [];
  }

  ngDoCheck() {

  }

  ngOnInit() {
    if (this.data) {
      this.icon = this.data.icon;
      this.premiumAmount = this.data.premium.premiumAmount;
      this.productName = this.data.productName;
      this.coverageDuration = this.data.coverageDuration;
      this.premiumDuration = this.data.premiumDuration;
      this.temp = this.data;
      this.type = this.type.toLowerCase();

      this.highlights.push({ title: 'Coverage Duration', description: this.data.coverageDuration });
      this.highlights.push({ title: 'Premium Duration', description: this.data.premiumDuration });
      if (this.type === 'long term care') {
        this.canShowDiscount = false;
        this.highlights.push({ title: 'No. of ADLs', description: this.data.coverageDuration });
      }
      if (this.type === 'hospital plan') {
        this.canShowDiscount = false;
        this.highlights.push({ title: 'Rider', description: this.data.coverageDuration });
      }
      if (this.type === 'occupational disability') {
        this.canShowRanking = true;
        this.highlights.push({ title: 'Deferred Period', description: this.data.coverageDuration });
        this.highlights.push({ title: 'Escalating Benefit', description: this.data.underWritting });
      }
      this.highlights.push({ title: 'Needs Medical Underwriting', description: this.data.underWritting });
    }
  }

  viewDetails() {
    console.log('View plan clicked');
    this.view.emit(this.temp);
  }

  selectPlan() {
    console.log('Plan selected');
    if (this.isSelected) {
      this.isSelected = false;
    } else {
      this.isSelected = true;
    }
    this.select.emit({ plan: this.temp, isSelected: this.isSelected });
  }
}
