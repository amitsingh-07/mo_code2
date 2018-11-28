import { catchError } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router } from '@angular/router';
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
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
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
  addBank: any;
  queryParams: any;
  buttonTitle;
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService,
    public topupAndWithDrawService: TopupAndWithDrawService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.queryParams = this.route.snapshot.queryParams;
    this.addBank = this.queryParams.addBank;
    if (this.addBank === 'true') {
      this.pageTitle = 'Add Bank Details';
      this.buttonTitle = 'Add Now';
    } else {
      this.pageTitle = 'Edit Bank Details';
      this.buttonTitle = 'Apply Changes';
    }
    this.setPageTitle(this.pageTitle);
    this.getLookupList();
    this.buildBankForm();
  }
  buildBankForm() {
    this.formValues = this.investmentAccountService.getBankInfo();
    this.bankForm = this.formBuilder.group({
      bank: [this.formValues.bank, [Validators.required]],
      accountNo: [this.formValues.accountNumber, [Validators.required]],
      accountHolderName: [this.formValues.fullName, [Validators.required]]
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
  applyChanges(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      return false;
    } else {
      // tslint:disable-next-line:no-all-duplicated-branches
      if (this.addBank === 'true') {
       // Add Bank API Here
       this.topupAndWithDrawService.saveNewBank(form.value).subscribe((response) => {
        if (response.responseMessage.responseCode >= 6000) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
        }
      });
      } else {
        const id = form.value.bank.id;
        console.log('current bank id ' + id);
        this.signUpService.updateBankInfo(form.value.bank, form.value.accountHolderName , form.value.accountNo , id).subscribe((data) => {
          // tslint:disable-next-line:triple-equals
          if ( data.responseMessage.responseCode == 6000) {
            // tslint:disable-next-line:max-line-length
          this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
          }
        });
      // Edit Bank APi here
      }
    }
  }
  getLookupList() {
    this.topupAndWithDrawService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    });
  }
}
