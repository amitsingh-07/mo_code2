import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-plan-widget',
  templateUrl: './plan-widget.component.html',
  styleUrls: ['./plan-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanWidgetComponent implements DoCheck, OnInit {
  @Input() data;
  icon;
  premiumAmount;
  productName;
  features;
  temp;
  isSelected = false;

  coverageDuration;
  premiumDuration;

  @Output() view = new EventEmitter();
  @Output() select = new EventEmitter();

  constructor() { }

  ngDoCheck() {
    if (this.data) {
      this.icon = this.data.icon;
      this.premiumAmount = this.data.premium.premiumAmount;
      this.productName = this.data.productName;
      this.coverageDuration = this.data.coverageDuration;
      this.premiumDuration = this.data.premiumDuration;
      this.features = this.data.features;
      this.temp = this.data;
    }
  }

  ngOnInit() {
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
    this.select.emit({plan: this.temp, isSelected: this.isSelected});
  }
}
