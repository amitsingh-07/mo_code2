import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-instruction-steps',
  templateUrl: './instruction-steps.component.html',
  styleUrls: ['./instruction-steps.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstructionStepsComponent implements OnInit {

  @Input() bankDetails;
  @Input() paynowDetails;
  @Input() showBankTransferIns;

  @Output() showToolTip: EventEmitter<any> = new EventEmitter();

  constructor(public readonly translate: TranslateService,
              private modal: NgbModal) { }

  ngOnInit() {
  }

  showToolTipModal() {
    this.showToolTip.emit();
  }
}
