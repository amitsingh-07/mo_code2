import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-additional-declaration-screen2',
  templateUrl: './additional-declaration-screen2.component.html',
  styleUrls: ['./additional-declaration-screen2.component.scss']
})
export class AdditionalDeclarationScreen2Component implements OnInit {
  pageTitle: string;
  sourceOfIncomeList;
  additionDeclarationtwo: FormGroup;
  formValues;
  additionDeclarationtwoFormValues;
  sourse: string;
  constructor(
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getSourceList();

    // this.additionDeclarationtwo = this.formBuilder.group({
    //   source: [this.formValues.source, Validators.required],
    //   expectedNumberOfTransation: [this.formValues.expectedNumberOfTransation, Validators.required],
    //   expectedAmountPerTranction: [this.formValues.esexpectedAmountPerTranction, Validators.required]

    // });
  }
  getSourceList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.sourceOfIncomeList = data.objectList.investmentSource;
      console.log(this.sourceOfIncomeList);
    });
  }

  selectSource(sourceObj) {
    this.sourse = sourceObj;

  }
  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setEmployeAddressFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS]);
    }
  }

}
