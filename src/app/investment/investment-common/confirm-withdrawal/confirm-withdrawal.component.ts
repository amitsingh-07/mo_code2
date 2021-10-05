import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../../shared/utils/util';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { INVESTMENT_COMMON_ROUTES, INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';

@Component({
  selector: 'app-confirm-withdrawal',
  templateUrl: './confirm-withdrawal.component.html',
  styleUrls: ['./confirm-withdrawal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmWithdrawalComponent implements OnInit {

  pageTitle: string;
  editPageTitle: string;
  withdrawalAccountForm: FormGroup;
  banks: any;
  accountNumberCharCount = 0;
  userPortfolioType: any;
  userProfileInfo: any;
  navigationType: any;
  customerPortfolioId: any;
  isJAAccount: boolean;
  bankDetails: any;
  constructor(
    private router: Router,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    public manageInvestmentsService: ManageInvestmentsService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private loaderService: LoaderService
  ) {
    this.navigationType = this.investmentCommonService.setNavigationType(this.router.url, INVESTMENT_COMMON_ROUTES.EDIT_WITHDRAWAL,
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CONFIRM_WITHDRAWAL.PAGE_TITLE');
      this.editPageTitle = this.translate.instant('CONFIRM_WITHDRAWAL.EDIT_PAGE_TITLE');
      if (this.navigationType) {
        this.setPageTitle(this.editPageTitle);
      } else {
        this.setPageTitle(this.pageTitle);
      }
    });
    this.userProfileInfo = signUpService.getUserProfileInfo();
    this.customerPortfolioId = this.investmentAccountService.getCustomerPortfolioId();
    this.userPortfolioType = investmentEngagementService.getUserPortfolioType();
    this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID ? this.isJAAccount = true : this.isJAAccount = false;
    this.getOptionList();
    this.buildAccountDetailsForm();
    this.getExistingBankDetails(this.customerPortfolioId, this.isJAAccount);
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildAccountDetailsForm() {
    this.withdrawalAccountForm = new FormGroup({
      accountHolderName: new FormControl('', [Validators.required]),
      bank: new FormControl('', Validators.required),
      accountNo: new FormControl('', [Validators.required, this.signUpService.validateBankAccNo]),
    });
    this.withdrawalAccountForm.controls.accountHolderName.setValue(this.userProfileInfo?.fullName);
  }

  goToNext() {
    if (this.withdrawalAccountForm.valid) {
      this.manageInvestmentsService.saveJAWithdrawalBank(this.withdrawalAccountForm.value, this.customerPortfolioId, this.isJAAccount, true).subscribe((response) => {
        if (!Util.isEmptyOrNull(this.navigationType)) {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.PORTFOLIO_SUMMARY]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_ACCOUNT_DETAILS]);
        }
      });
    }
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  setControlValue(value, controlName, formName) {
    value = value.trim().replace(RegexConstants.trimSpace, ' ');
    this.investmentAccountService.setControlValue(value, controlName, formName);
  }

  setDropDownValue(key, event) {
    setTimeout(() => {
      this.withdrawalAccountForm.controls[key].setValue(event);
      this.withdrawalAccountForm.get('accountNo').updateValueAndValidity();
    }, 100);
  }

  getOptionList() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
    this.manageInvestmentsService.getAllDropDownList().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      this.banks = data.objectList.bankList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  onAccountNumberChange(accountNumber) {
    this.accountNumberCharCount = accountNumber ? accountNumber.length : 0;
  }

  getExistingBankDetails(customerPortfolioId, isJointAccount) {
    this.investmentCommonService.getJAAccountDetails(customerPortfolioId, isJointAccount, true).subscribe((data) => {
      this.bankDetails = data.objectList;
      if (this.bankDetails && this.bankDetails.length > 0) {
        this.withdrawalAccountForm.controls.accountHolderName.setValue(this.bankDetails[0].accountName);
        this.withdrawalAccountForm.controls.accountNo.setValue(this.bankDetails[0].accountNumber);
        this.withdrawalAccountForm.controls.bank.setValue(this.bankDetails[0].bank);
        this.withdrawalAccountForm.addControl(
          'id', new FormControl(this.bankDetails[0].id)
        );
      }
    });
  }
}
