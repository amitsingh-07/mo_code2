import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breakdown-accordion',
  templateUrl: './breakdown-accordion.component.html',
  styleUrls: ['./breakdown-accordion.component.scss']
})
export class BreakdownAccordionComponent implements OnInit {

  @Input('allocation') allocation;
  @Input('activeIndex') activeIndex;
  @Input('colors') colors;
  curAllocation: any;

  @Output() selectAllocationAccordion = new EventEmitter<boolean>();
  @Output() selectFundDetails = new EventEmitter();

  constructor(
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  emitSelectedAllocation(index) {
    this.selectAllocationAccordion.emit(index);
  }

  emitSelectedFund(fund) {
    this.selectFundDetails.emit(fund);
  }
}
