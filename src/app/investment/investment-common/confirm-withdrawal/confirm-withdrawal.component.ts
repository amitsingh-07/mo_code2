import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';

@Component({
  selector: 'app-confirm-withdrawal',
  templateUrl: './confirm-withdrawal.component.html',
  styleUrls: ['./confirm-withdrawal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmWithdrawalComponent implements OnInit {

  pageTitle: string;
  withdrawalAccountForm: FormGroup;
  banks: any;
  constructor(
    private router: Router,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    public manageInvestmentsService: ManageInvestmentsService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CONFIRM_WITHDRAWAL.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.getOptionList();
    this.buildAccountDetailsForm();
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
      nameOnAccount: new FormControl('', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]),
      bankName: new FormControl('', Validators.required),
      accountNumber: new FormControl('', [Validators.required, this.signUpService.validateBankAccNo]),
    })
  }

  goToNext() {
    if (!this.withdrawalAccountForm.valid) {

    }
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_ACCOUNT_DETAILS])
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  setControlValue(value, controlName, formName) {
    value = value.trim().replace(RegexConstants.trimSpace, ' ');
    this.investmentAccountService.setControlValue(value, controlName, formName);
  }

  setDropDownValue(event, key, isMinor) {
    setTimeout(() => {
      this.withdrawalAccountForm.controls[key].setValue(event);
    }, 100);
  }

  getOptionList() {
    this.manageInvestmentsService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
}
