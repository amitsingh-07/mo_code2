import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentAccountService } from './../../../investment/investment-account/investment-account-service';
import { ProfileIcons } from './../../../investment/investment-engagement-journey/recommendation/profileIcons';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../../../investment/manage-investments/manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from './../../../investment/manage-investments/manage-investments.constants';
import { ManageInvestmentsService } from './../../../investment/manage-investments/manage-investments.service';
import { LoaderService } from './../../components/loader/loader.service';
import { ErrorModalComponent } from './../error-modal/error-modal.component';

@Component({
  selector: 'app-review-buy-request-modal',
  templateUrl: './review-buy-request-modal.component.html',
  styleUrls: ['./review-buy-request-modal.component.scss']
})
export class ReviewBuyRequestModalComponent implements OnInit {
  @Input() fundDetails;
  @Input() cashBalance: number;
  requestAmount: string;
  requestType: string;
  portfolioType: string;
  riskProfileImg: string;
  noteArray;
  isRequestSubmitted = false;

  @Output() submitRequest: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
              public readonly translate: TranslateService,
              public manageInvestmentsService: ManageInvestmentsService,
              private loaderService: LoaderService,
              private modal: NgbModal,
              public investmentAccountService: InvestmentAccountService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.requestAmount = this.fundDetails['oneTimeInvestment'];
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.ONETINE_INVESTMENT;
      if (this.fundDetails['isAmountExceedBalance'] === true) {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.INSUFFICIENT_ONETIME_NOTE');
      } else {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.SUFFICIENT_ONETIME_NOTE');
      }
    } else if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
      this.requestAmount = this.fundDetails['monthlyInvestment'];
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT;
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_NOTE');
    }
    this.portfolioType = this.fundDetails['portfolio']['riskProfileType'];
    if (this.fundDetails['portfolio']['riskProfileId']) {
      this.riskProfileImg =
        ProfileIcons[this.fundDetails.portfolio.riskProfileId - 1]['icon'];
    }
  }

  buyPortfolio() {
    this.activeModal.close();
    if (this.fundDetails.oneTimeInvestment) {
      this.topUpOneTime();
    } else {
      this.topUpMonthly();
    }
  }
  // ONETIME INVESTMENT
  topUpOneTime() {
    if (!this.isRequestSubmitted) {
      this.showLoader();
      this.manageInvestmentsService.buyPortfolio(this.fundDetails).subscribe(
        (response) => {
          this.successHandler(response);
        },
        (err) => {
          this.errorHandler();
        }
      );
    }
  }
  // MONTHLY INVESTMENT
  topUpMonthly() {
    if (!this.isRequestSubmitted) {
      this.showLoader();
      this.manageInvestmentsService.monthlyInvestment(this.fundDetails).subscribe(
        (response) => {
          this.successHandler(response);
        },
        (err) => {
          this.errorHandler();
        }
      );
    }
  }

  showLoader() {
    this.isRequestSubmitted = true;
    this.loaderService.showLoader({
      title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
      desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
    });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  successHandler(response) {
    this.isRequestSubmitted = false;
    this.loaderService.hideLoader();
    if (response.responseMessage.responseCode < 6000) {
      if (
        response.objectList &&
        response.objectList.length &&
        response.objectList[response.objectList.length - 1].serverStatus &&
        response.objectList[response.objectList.length - 1].serverStatus.errors &&
        response.objectList[response.objectList.length - 1].serverStatus.errors.length
      ) {
        this.showCustomErrorModal(
          'Error!',
          response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
        );
      } else if (response.responseMessage && response.responseMessage.responseDescription) {
        const errorResponse = response.responseMessage.responseDescription;
        this.showCustomErrorModal('Error!', errorResponse);
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    } else {
      if (!this.fundDetails.isAmountExceedBalance) {
        this.router.navigate([
          MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/success'
        ]);
      } else {
        this.router.navigate([
          MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/pending'
        ]);
      }
    }
  }

  errorHandler() {
    this.isRequestSubmitted = false;
    this.loaderService.hideLoader();
    this.investmentAccountService.showGenericErrorModal();
  }
}
