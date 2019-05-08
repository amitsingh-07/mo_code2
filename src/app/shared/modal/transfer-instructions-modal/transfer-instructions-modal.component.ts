import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InstructionStepsComponent } from '../bank-details/instruction-steps/instruction-steps.component';

@Component({
  selector: 'app-transfer-instructions-modal',
  templateUrl: './transfer-instructions-modal.component.html',
  styleUrls: ['./transfer-instructions-modal.component.scss']
})
export class TransferInstructionsModalComponent implements OnInit {
  FUND_YOUR_ACCOUNT;
  activeMode = 'BANK';

  @Input() bankDetails;
  @Input() paynowDetails;

  constructor(public activeModal: NgbActiveModal,
              public readonly translate: TranslateService) {
  }

  ngOnInit() {
  }

  selectFundingMethod(mode) {
    this.activeMode = mode;
  }

}
