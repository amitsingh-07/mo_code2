import { filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../error-modal/error-modal.component';

import {
    INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
    RecommendationComponent
} from '../../../investment/investment-engagement-journey/recommendation/recommendation.component';

@Component({
  selector: 'app-payment-instruction-modal',
  templateUrl: './payment-instruction-modal.component.html',
  styleUrls: ['./payment-instruction-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentInstructionModalComponent implements OnInit {  
  @Input() closeBtn = true;
  activeMode = 'BANK';

  @Output() showCopyToast: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService,
	private modal1: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
                // dismiss all bootstrap modal dialog
                this.activeModal.dismiss();
            });
  }
  selectFundingMethod(mode) {
    this.activeMode = mode;
  }
  showPopUp() {
    const ref = this.modal1.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = 
      'FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.TITLE';
    ref.componentInstance.errorMessage = 
      'FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.MESSAGE';
  }
  showTipModal() {
    this.showPopUp();
  }
  getQrCodeImg() {
    return document.getElementsByTagName('base')[0].href + 'assets/images/comprehensive/qrcode.png';
  }

  notify(event) {
    const toasterMsg = {
      desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
    };
    this.showCopyToast.emit(toasterMsg);
  }
}
