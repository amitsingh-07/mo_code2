import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { GuideMeService } from '../../guide-me.service';
import { IResultItem } from './insurance-result';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insurance-result',
  templateUrl: './insurance-result.component.html',
  styleUrls: ['./insurance-result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceResultComponent implements DoCheck, OnInit {
  @Input() data: IResultItem;
  icon;
  amount;
  title;
  temp;
  isMonthEnabled;
  viewDetailsBtn = true;
  plans;

  @Output() Details = new EventEmitter();

  // tslint:disable-next-line:cognitive-complexity
  ngDoCheck() {
    if (this.data) {
      this.icon = this.data.icon;
      if (this.data.existingCoverage) {
        this.amount = this.data.existingCoverage.value > this.data.total.value
          ? 0 : this.data.total.value - this.data.existingCoverage.value;
      } else {
        this.amount = this.data.total.value > 0 ? this.data.total.value : 0;
      }
      this.title = this.data.title;
      this.temp = this.data;
      // Is Month Enabled
      if (this.title === this.plans.OCCUPATIONAL_DISABILITY.TITLE || this.title === this.plans.LONG_TERM_CARE.TITLE) {
        this.isMonthEnabled = true;
      } else {
        this.isMonthEnabled = false;
      }
      // View Details Button
      if (this.title === this.plans.HOSPITAL_PLAN.TITLE) {

        const hospitalPlan: any = this.guideMeService.getHospitalPlan().hospitalClass;
        this.amount = hospitalPlan;

        this.viewDetailsBtn = false;
      }
    }
  }

  constructor(private guideMeService: GuideMeService, private translate: TranslateService) {

      this.translate.use('en');
      this.translate.get('COMMON').subscribe(() => {
        this.plans = this.translate.instant('INSURANCE_RESULTS.PLANS');
      });
    }

  ngOnInit() {
  }

  viewDetails() {
    this.Details.emit(this.temp);
  }
}
