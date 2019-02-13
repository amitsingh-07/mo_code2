import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankDetailsComponent implements OnInit {

  @Input() errorTitle: any;
  @Input() errorDescription: any;
  @Input() bankDetailsLists: any;
  @Input() showBankTransctions: any;
  @Input() showPayNow: any;
  @Input() setBankDetails: any;
  @Input() setPaynowDetails: any;

  constructor(public activeModal: NgbActiveModal,
    public readonly translate: TranslateService) { }

  ngOnInit() {
  }

}
