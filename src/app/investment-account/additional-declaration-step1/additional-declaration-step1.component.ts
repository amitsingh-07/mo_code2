import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-additional-declaration-step1',
  templateUrl: './additional-declaration-step1.component.html',
  styleUrls: ['./additional-declaration-step1.component.scss']
})
export class AdditionalDeclarationStep1Component implements OnInit {
  occupationList;
  pageTitle: string;
  translator: any;
  addInfoForm: FormGroup;
  addInfoFormValues: any;
  selectedOccupation: string;
  selectedCountry: string;
  countries: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATION.TITLE');
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getOccupationList();
    this.countries = ['Singapore'];
    this.addInfoFormValues = this.investmentAccountService.getPepInfo();
    this.addInfoForm = new FormGroup({
      radioPep: new FormControl (this.addInfoFormValues.radioPep, Validators.required),
      fName: new FormControl (this.addInfoFormValues.fName, Validators.required),
      lName: new FormControl (this.addInfoFormValues.lName, Validators.required),
      cName: new FormControl (this.addInfoFormValues.cName, Validators.required),
      pepoccupation: new FormControl (this.addInfoFormValues.pepoccupation, Validators.required),
      pepCountry: new FormControl (this.addInfoFormValues.pepCountry, Validators.required),
      pepPostalCode: new FormControl (this.addInfoFormValues.pepPostalCode, Validators.required),
      pepAddress1: new FormControl (this.addInfoFormValues.pepAddress1, Validators.required),
      pepAddress2: new FormControl (this.addInfoFormValues.pepAddress2, Validators.required),
      pepUnitNo: new FormControl (this.addInfoFormValues.pepUnitNo, Validators.required),
      });
    this.selectedOccupation = this.translate.instant('ADDITIONAL_DECLARATION.SELECT_OCCUPATION');
    this.selectedCountry = 'Singapore';
    this.addInfoForm.controls.radioPep.setValue('yes');
    this.addInfoForm.controls.pepCountry.setValue('Singapore');
  }
  getOccupationList() {
    this.authService.authenticate().subscribe((token) => {
      this.investmentAccountService.getOccupationList().subscribe((data) => {
        this.occupationList = data.objectList;
      });
    });

  }
  setOccupationValue(value) {
  this.selectedOccupation = value;
  this.addInfoForm.controls.pepoccupation.setValue(value);
  }

  setDropDownValue(value) {
    this.selectedCountry = value;
    this.addInfoForm.controls.pepCountry.setValue(value);
}
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription =  this.translator.PEP_DESC;
    return false;
  }
  retrieveAddress(postalCode, address1Control, address2Control) {
    this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe(
      (response: any) => {
        if (response) {
          if (response.Status.code === 200) {
            const address1 = response.Placemark[0].AddressDetails.Country.Thoroughfare.ThoroughfareName;
            const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
            address1Control.setValue(address1);
            address2Control.setValue(address2);
          } else {
            const ref = this.modal.open(ErrorModalComponent, { centered: true });
            ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE');
            ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC');
            address1Control.setValue('');
            address2Control.setValue('');
          }
        }
      },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC');
      });
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
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
        this.investmentAccountService.setAdditionalInfoFormData(form.value);
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2]);
      }
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
}
