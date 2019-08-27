import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer-instructions-modal',
  templateUrl: './transfer-instructions-modal.component.html',
  styleUrls: ['./transfer-instructions-modal.component.scss']
})
export class TransferInstructionsModalComponent implements OnInit {
  FUNDING_INSTRUCTIONS;
  activeMode = 'BANK';
  showBankTransferSteps = true;

  @Input() bankDetails;
  @Input() paynowDetails;
  @Output() activeTab: EventEmitter<any> = new EventEmitter();
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  @Output() openModal: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
              public readonly translate: TranslateService) {
  }

  ngOnInit() {
    this.activeTab.emit(this.activeMode);
  }

  selectFundingMethod(mode) {
    this.activeMode = mode;
    this.activeTab.emit(mode);
  }

  modalClose() {
    this.closeModal.emit();
  }

  showTipModal() {
    this.openModal.emit();
  }

}
