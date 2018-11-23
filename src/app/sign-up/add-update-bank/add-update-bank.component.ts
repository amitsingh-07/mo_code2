import { catchError } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountCommon } from '../../investment-account/investment-account-common';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../../investment-account/investment-account.constant';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-add-update-bank',
  templateUrl: './add-update-bank.component.html',
  styleUrls: ['./add-update-bank.component.scss']
})
export class AddUpdateBankComponent implements OnInit {
  pageTitle;
  formValues: any;
  banks: any;
  bankForm: FormGroup;
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Edit Bank Details';
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.buildBankForm();
  }
  buildBankForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.bankForm = this.formBuilder.group({
      bankName: [this.formValues.oldPassword, [Validators.required]],
      account: [this.formValues.oldPassword, [Validators.required]],
    });
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setDropDownValue(key, value) {
    this.bankForm.controls[key].setValue(value);
  }
  setNestedDropDownValue(key, value, nestedKey) {
    this.bankForm.controls[nestedKey]['controls'][key].setValue(value);
  }

}
