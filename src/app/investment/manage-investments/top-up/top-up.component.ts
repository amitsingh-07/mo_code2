import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { LoaderService } from './../../../shared/components/loader/loader.service';
import { ReviewBuyRequestModalComponent } from './../../../shared/modal/review-buy-request-modal/review-buy-request-modal.component';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../manage-investments-routes.constants';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopUpComponent implements OnInit {
  pageTitle: string;
  portfolio;
  investment;
  portfolioList;
  isAmountExceedBalance = false;
  topupAmount: any;
  investmentTypeList: any;
  showOnetimeInvestmentAmount = true;
  showmonthlyInvestmentAmount = false;
  formValues;
  topForm: FormGroup;
  enteringAmount;
  cashBalance;
  fundDetails;
  currentMonthlyInvAmount; // current monthly rsp amount
  currentOneTimeInvAmount; // current monthly rsp amount
  isRequestSubmitted = false;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    public manageInvestmentsService: ManageInvestmentsService,
    private investmentAccountService: InvestmentAccountService,
    private currencyPipe: CurrencyPipe,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TOPUP.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.getPortfolioList();
    this.getTopupInvestmentList();
    this.cashBalance = this.manageInvestmentsService.getUserCashBalance();
    this.fundDetails = this.manageInvestmentsService.getFundingDetails();
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.topForm = this.formBuilder.group({
      portfolio: [this.formValues.portfolio ? this.formValues.portfolio : this.formValues.selectedCustomerPortfolio, Validators.required],
      Investment: [
        this.formValues.Investment ? this.formValues.Investment : 'One-time Investment',
        Validators.required
      ],
      oneTimeInvestmentAmount: [
        this.formValues.oneTimeInvestmentAmount,
        Validators.required
      ]
    });
    if (this.formValues['selectedCustomerPortfolio']) {
      this.getMonthlyInvestmentInfo(this.formValues['selectedCustomerPortfolioId']);
      this.getOneTimeInvestmentInfo(this.formValues['selectedCustomerPortfolioId']);
    }
    this.buildFormInvestment();
  }
  getPortfolioList() {
    this.portfolioList = this.manageInvestmentsService.getUserPortfolioList();
  }
  setDropDownValue(key, value) {
    this.topForm.controls[key].setValue(value);
    console.log('value = ', value)
    this.getOneTimeInvestmentInfo(value['customerPortfolioId']);
    this.getMonthlyInvestmentInfo(value['customerPortfolioId']);
  }
  getTopupInvestmentList() {
    this.manageInvestmentsService.getTopupInvestmentList().subscribe((data) => {
      this.investmentTypeList = data.objectList.topupInvestment; // Getting the information from the API
      this.setOnetimeMinAmount(this.investmentTypeList);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  validateAmonut(amount) {
    if (amount > this.fundDetails['portfolio']['cashAccountBalance']) {
      this.topupAmount = amount - this.fundDetails['portfolio']['cashAccountBalance'];
      this.isAmountExceedBalance = true;
    } else {
      this.isAmountExceedBalance = false;
    }
  }

  selectedInvestment(investmenttype) {
    this.investment = investmenttype;
    this.manageInvestmentsService.setInvestmentValue(this.investment.value);
    this.formValues.Investment = this.investment.name;
    this.isAmountExceedBalance = false;
    this.topupAmount = 0;
    this.buildFormInvestment();
  }
  buildFormInvestment() {
    if (this.formValues.Investment === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT) {
      this.topForm.addControl(
        'MonthlyInvestmentAmount',
        new FormControl('', Validators.required)
      );
      this.topForm.removeControl('oneTimeInvestmentAmount');
      this.showOnetimeInvestmentAmount = false;
      this.showmonthlyInvestmentAmount = true;
      this.ExceedAmountMonthly();
      if (this.currentMonthlyInvAmount) { // If monthly investment already exists, allow zero
        this.topForm.get('MonthlyInvestmentAmount').clearValidators();
        this.topForm.get('MonthlyInvestmentAmount').updateValueAndValidity();
      }
    } else {
      this.topForm.addControl(
        'oneTimeInvestmentAmount',
        new FormControl('', Validators.required)
      );
      this.topForm.removeControl('MonthlyInvestmentAmount');
      this.showOnetimeInvestmentAmount = true;
      this.showmonthlyInvestmentAmount = false;
      this.ExceedAmountOneTime();
    }
  }
  ExceedAmountOneTime() {
    if (this.topForm.get('oneTimeInvestmentAmount')) {
      this.topForm.get('oneTimeInvestmentAmount').valueChanges.subscribe((value) => {
        this.validateAmonut(value);
      });
      this.topForm
        .get('oneTimeInvestmentAmount')
        .setValue(this.formValues.oneTimeInvestmentAmount); // SETTING VALUE TO MOCK CHANGE EVENT
    }
  }
  ExceedAmountMonthly() {
    if (this.topForm.get('MonthlyInvestmentAmount')) {
      this.topForm.get('MonthlyInvestmentAmount').valueChanges.subscribe((value) => {
        this.validateAmonut(value);
      });
      this.topForm
        .get('MonthlyInvestmentAmount')
        .setValue(this.formValues.MonthlyInvestmentAmount); // SETTING VALUE TO MOCK CHANGE EVENT
    }
  }
  setOnetimeMinAmount(data) {
    if (this.formValues.Investment === 'Monthly Investment') {
      this.manageInvestmentsService.setInvestmentValue(data[1].value);
    } else {
      this.manageInvestmentsService.setInvestmentValue(data[0].value);
    }
  }
  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.manageInvestmentsService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      const allowZero = (this.currentMonthlyInvAmount > 0);
      const error = this.manageInvestmentsService.doFinancialValidations(form, allowZero);
      if (error) {
        // tslint:disable-next-line:no-commented-code
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
        ref.componentInstance.errorTitle = error.errorTitle;
        ref.componentInstance.errorMessage = error.errorMessage;
        // tslint:disable-next-line:triple-equals
      } else {
          this.saveAndProceed(form);
        // }
      }
    }
  }
  saveAndProceed(form: any) {
    form.value.topupAmount = this.topupAmount;
    this.manageInvestmentsService.setTopUp(form.value);
    this.saveFundingDetails();
    this.showReviewBuyRequestModal(form);
  }
  saveFundingDetails() {

    if (this.formValues.oneTimeInvestmentAmount) {
      this.topupAmount = this.formValues.oneTimeInvestmentAmount - this.formValues.portfolio['cashAccountBalance'];
    } else {
      this.topupAmount = this.formValues.MonthlyInvestmentAmount || 0 - this.formValues.portfolio['cashAccountBalance'];
    }

    const topupValues = {
      source: MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.TOPUP,
      portfolio: this.formValues.portfolio,
      oneTimeInvestment: this.formValues.oneTimeInvestmentAmount, // topup
      monthlyInvestment: this.formValues.MonthlyInvestmentAmount ? this.formValues.MonthlyInvestmentAmount : 0, // topup
      fundingType: this.formValues.Investment === 'Monthly Investment'
        ? MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY
        : MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME,
      isAmountExceedBalance: this.topupAmount > 0 ? true : false,
      exceededAmount: this.topupAmount
    };
    this.manageInvestmentsService.setFundingDetails(topupValues);
  }

  getMonthlyInvestmentInfo(customerPortfolioId) {
    this.manageInvestmentsService.getMonthlyInvestmentInfo(customerPortfolioId).subscribe((response) => {
      if (response.responseMessage.responseCode >= 6000) {
        this.currentMonthlyInvAmount = response.objectList.monthlyInvestment;
         // If monthly investment already exists, allow zero
        if (this.currentMonthlyInvAmount && this.topForm.get('MonthlyInvestmentAmount')) {
          this.topForm.get('MonthlyInvestmentAmount').clearValidators();
          this.topForm.get('MonthlyInvestmentAmount').updateValueAndValidity();
        }
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  getOneTimeInvestmentInfo(customerProfileId) {
    this.manageInvestmentsService.getOneTimeInvestmentInfo(customerProfileId).subscribe((response) => {
      if (response.responseMessage.responseCode >= 6000) {
        this.currentOneTimeInvAmount = response.objectList && response.objectList.amount ? response.objectList.amount : 0;
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  showConfirmOverwriteModal(form, invAmount: number, formName: string, descText: string) {
    const translateParams = {
      existingOrderAmount: this.currencyPipe.transform(invAmount, 'USD', 'symbol-narrow', '1.2-2'),
      newOrderAmount: this.currencyPipe.transform(
        this.topForm.get(formName).value ? this.topForm.get(formName).value  : 0,
        'USD',
        'symbol-narrow',
        '1.2-2'
        )
    };
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('TOPUP.CONFIRM_OVERWRITE_MODAL.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant(descText, translateParams);
    ref.componentInstance.primaryActionLabel = this.translate.instant('TOPUP.CONFIRM_OVERWRITE_MODAL.YES');
    ref.componentInstance.isInlineButton = true;
    ref.componentInstance.closeBtn = false;
    ref.componentInstance.primaryAction.subscribe((emittedValue) => {
      ref.close();
      this.buyPortfolio();
    });
    ref.componentInstance.secondaryActionLabel = this.translate.instant('TOPUP.CONFIRM_OVERWRITE_MODAL.NO');
    ref.componentInstance.secondaryActionDim = true;
    ref.componentInstance.secondaryAction.subscribe((emittedValue) => {
      ref.close();
    });
  }

  showReviewBuyRequestModal(form) {
    const ref = this.modal.open(ReviewBuyRequestModalComponent, { centered: true, windowClass: 'review-buy-request-modal' });
    ref.componentInstance.fundDetails = this.manageInvestmentsService.getFundingDetails();
    ref.componentInstance.submitRequest.subscribe((emittedValue) => {
      this.checkIfExistingBuyRequest(form);
    });
  }

  checkIfExistingBuyRequest(form) {
    if (this.formValues.Investment === 'Monthly Investment' && this.currentMonthlyInvAmount) {
      this.showConfirmOverwriteModal(form, this.currentMonthlyInvAmount, 'MonthlyInvestmentAmount',
       'TOPUP.CONFIRM_OVERWRITE_MODAL.DESC');
    } else if ((this.formValues.Investment === 'One-time Investment' || !this.formValues.Investment)
     && this.currentOneTimeInvAmount) {
      this.showConfirmOverwriteModal(form, this.currentOneTimeInvAmount, 'oneTimeInvestmentAmount',
       'TOPUP.CONFIRM_OVERWRITE_MODAL.ONE_TIME_DESC');
     } else {
      this.buyPortfolio();
     }
  }

  buyPortfolio() {
    const buyRequestFundDetails = this.manageInvestmentsService.getFundingDetails();
    if (this.fundDetails.oneTimeInvestment) {
      this.topUpOneTime(buyRequestFundDetails);
    } else {
      this.topUpMonthly(buyRequestFundDetails);
    }
  }
 // ONETIME INVESTMENT
 topUpOneTime(buyRequestFundDetails) {
  if (!this.isRequestSubmitted) {
    this.isRequestSubmitted = true;
    this.loaderService.showLoader({
      title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
      desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
    });
    this.manageInvestmentsService.buyPortfolio(buyRequestFundDetails).subscribe(
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
topUpMonthly(buyRequestFundDetails) {
  if (!this.isRequestSubmitted) {
    this.isRequestSubmitted = true;
    this.loaderService.showLoader({
      title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
      desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
    });
    this.manageInvestmentsService.monthlyInvestment(buyRequestFundDetails).subscribe(
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
