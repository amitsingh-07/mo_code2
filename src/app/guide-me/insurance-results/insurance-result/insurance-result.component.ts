import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { IResultItem } from './insurance-result';

@Component({
  selector: 'app-insurance-result',
  templateUrl: './insurance-result.component.html',
  styleUrls: ['./insurance-result.component.scss']
})
export class InsuranceResultComponent implements DoCheck, OnInit {
  @Input() data: IResultItem;
  icon;
  amount;
  title;
  temp;
  isMonthEnabled;
  viewDetailsBtn = true;

  @Output() Details = new EventEmitter();

  ngDoCheck() {
    if (this.data) {
      this.icon = this.data.icon;
      this.amount = this.data.existingCoverage.value > this.data.total.value
            ? 0 : this.data.total.value - this.data.existingCoverage.value;

      this.title = this.data.title;
      this.temp = this.data;
      // Is Month Enabled
      if (this.title === 'Occupational Disability' || this.title === 'Long-Term Care') {
        this.isMonthEnabled = true;
      } else {
        this.isMonthEnabled = false;
      }
      // View Details Button
      if (this.title === 'Hospital Plan') {
        this.amount = this.data.content;
        this.viewDetailsBtn = false;
      }
    }
 }
  constructor() { }

  ngOnInit() {
  }

  viewDetails() {
    this.Details.emit(this.temp);
  }
}
