import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { appConstants } from '../../../../app.constants';
import { AuthenticationService } from '../../../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-instruction-steps',
  templateUrl: './instruction-steps.component.html',
  styleUrls: ['./instruction-steps.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstructionStepsComponent implements OnInit {
  corpFaq = appConstants.CORPORATE_FAQ;
  @Input() bankDetails;
  @Input() paynowDetails;
  @Input() showBankTransferIns;

  @Output() showToolTip: EventEmitter<any> = new EventEmitter();
  @Output() showCopyToast: EventEmitter<any> = new EventEmitter();

  constructor(public readonly translate: TranslateService,
              private modal: NgbModal,
              public authService: AuthenticationService) { }

  ngOnInit() {
  }

  showToolTipModal() {
    this.showToolTip.emit();
  }

  getQrCodeImg() {
    return document.getElementsByTagName('base')[0].href + 'assets/images/paynow-qrcode.png';
  }

  notify(event) {
    this.showCopyToast.emit(event);
  }
}
