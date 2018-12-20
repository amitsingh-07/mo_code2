import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../../config/config.service';
import { Formatter } from '../../../shared/utils/formatter.util';
import { InvestmentAccountService } from '../../investment-account-service';

@Component({
  selector: 'app-fees-modal',
  templateUrl: './fees-modal.component.html',
  styleUrls: ['./fees-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeesModalComponent implements OnInit {

  @Input() feesBreakup: any;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {

  }

}
