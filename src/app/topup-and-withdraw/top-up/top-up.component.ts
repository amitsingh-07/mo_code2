import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

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
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    public topupAndWithDrawService: TopupAndWithDrawService,
    private investmentAccountService: InvestmentAccountService
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
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getPortfolioList();
    this.getTopupInvestmentList();
    this.cashBalance = this.topupAndWithDrawService.getUserCashBalance();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.topForm = this.formBuilder.group({
      portfolio: [this.formValues.PortfolioValues, Validators.required],
      Investment: [
        this.formValues.Investment ? this.formValues.Investment : 'One-time Investment',
        Validators.required
      ],
      oneTimeInvestmentAmount: [
        this.formValues.oneTimeInvestmentAmount,
        Validators.required
      ]
    });
    this.buildFormInvestment();
  }
  getPortfolioList() {
    this.portfolioList = this.topupAndWithDrawService.getUserPortfolioList();
  }
  setDropDownValue(key, value) {
    this.topForm.controls[key].setValue(value);
  }
  getTopupInvestmentList() {
    this.topupAndWithDrawService.getTopupInvestmentList().subscribe((data) => {
      this.investmentTypeList = data.objectList.topupInvestment; // Getting the information from the API
      this.setOnetimeMinAmount(this.investmentTypeList);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  validateAmonut(amount) {
    if (amount > this.cashBalance) {
      this.topupAmount = amount - this.cashBalance;
      this.isAmountExceedBalance = true;
    } else {
      this.isAmountExceedBalance = false;
    }
  }

  selectedInvestment(investmenttype) {
    this.investment = investmenttype;
    this.topupAndWithDrawService.setInvestmentValue(this.investment.value);
    this.formValues.Investment = this.investment.name;
    this.isAmountExceedBalance = false;
    this.topupAmount = 0;
    this.buildFormInvestment();
  }
  buildFormInvestment() {
    if (this.formValues.Investment === TOPUPANDWITHDRAW_CONFIG.TOPUP.MONTHLY_INVESTMENT) {
      this.topForm.addControl(
        'MonthlyInvestmentAmount',
        new FormControl('', Validators.required)
      );
      this.topForm.removeControl('oneTimeInvestmentAmount');
      this.showOnetimeInvestmentAmount = false;
      this.showmonthlyInvestmentAmount = true;
      this.ExceedAmountMonthly();
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
    if (data[0].name === 'One-time Investment') {
      this.topupAndWithDrawService.setInvestmentValue(data[0].value);
    }
  }
  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.topupAndWithDrawService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      const error = this.topupAndWithDrawService.doFinancialValidations(form);
      console.log('error' + error);
      if (error) {
        // tslint:disable-next-line:no-commented-code
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
        ref.componentInstance.errorTitle = error.errorTitle;
        ref.componentInstance.errorMessage = error.errorMessage;
        // tslint:disable-next-line:triple-equals
      } else {
        this.saveAndProceed(form);
      }
    }
  }
  saveAndProceed(form: any) {
    form.value.topupAmount = this.topupAmount;
    this.topupAndWithDrawService.setTopUp(form.value);
    this.saveFundingDetails();
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
  }
  saveFundingDetails() {
    const topupValues = {
      source: TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.TOPUP,
      portfolio: this.formValues.portfolio,
      oneTimeInvestment: this.formValues.oneTimeInvestmentAmount, // topup
      monthlyInvestment: this.formValues.MonthlyInvestmentAmount, // topup
      fundingType: this.formValues.MonthlyInvestmentAmount
        ? TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.MONTHLY
        : TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.ONETIME,
      isAmountExceedBalance: this.isAmountExceedBalance,
      exceededAmount: this.topupAmount
    };
    this.topupAndWithDrawService.setFundingDetails(topupValues);
  }
}
