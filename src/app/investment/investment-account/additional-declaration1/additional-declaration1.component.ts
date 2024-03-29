import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';

@Component({
  selector: 'app-additional-declaration1',
  templateUrl: './additional-declaration1.component.html',
  styleUrls: ['./additional-declaration1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclaration1Component implements OnInit {
  occupationList;
  pageTitle: string;
  translator: any;
  addInfoForm: FormGroup;
  addInfoFormValues: any;
  countries: any;
  isUserNationalitySingapore;
  tooltipDetails: any;
  radioLabelValuePEP = [];
  defaultRadioStyleClass = 'btn-outline-primary fixed-btn--sm disabled';

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATION.TITLE');
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      this.tooltipDetails = this.translate.instant('BLOCKED_COUNTRY_TOOLTIP');
      this.setPageTitle(this.pageTitle);
      this.radioLabelValuePEP = [{
        name: this.translate.instant('ADDITIONAL_DECLARATION.YES'),
        value: this.translate.instant('COMMON.LBL_TRUE_VALUE')
      }, {
        name: this.translate.instant('ADDITIONAL_DECLARATION.NO'),
        value: this.translate.instant('COMMON.LBL_FALSE_VALUE')
      }];
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getOccupationList();
    this.countries = this.investmentAccountService.getCountriesFormDataByFilter();
    this.addInfoFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.addInfoForm = this.buildForm();
    this.addOrRemoveAdditionalControls(this.addInfoForm.get('pepCountry').value);
    this.observeCountryChange();
    this.observeOccupationChange();
    this.investmentAccountService.loadDDCRoadmap();
  }

  buildForm() {
    return new FormGroup({
      radioPEP: new FormControl({ value: this.addInfoFormValues.pep, disabled: true }),
      pepFullName: new FormControl(this.addInfoFormValues.pepFullName, [
        Validators.required,
        Validators.pattern(RegexConstants.NameWithSymbol)
      ]),
      cName: new FormControl(this.addInfoFormValues.cName, Validators.required),
      pepoccupation: new FormControl(
        this.addInfoFormValues.pepoccupation,
        Validators.required
      ),

      pepCountry: new FormControl(this.getDefaultCountry(), Validators.required),
      pepAddress1: new FormControl(this.addInfoFormValues.pepAddress1, [
        Validators.required,
        Validators.pattern(RegexConstants.AlphanumericWithSymbol)
      ]),
      pepAddress2: new FormControl(this.addInfoFormValues.pepAddress2, [
        Validators.pattern(RegexConstants.AlphanumericWithSymbol)
      ])
    });
  }

  addOrRemoveAdditionalControls(country) {
    if (this.addInfoFormValues.pepoccupation) {
      this.addOtherOccupation(this.addInfoFormValues.pepoccupation);
    }
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    if (isSingapore) {
      this.addInfoForm.addControl(
        'pepPostalCode',
        new FormControl(this.addInfoFormValues.pepPostalCode, [
          Validators.required,
          Validators.pattern(RegexConstants.NumericOnly)
        ])
      );
      this.addInfoForm.addControl(
        'pepFloor',
        new FormControl(this.addInfoFormValues.pepFloor, [
          Validators.pattern(RegexConstants.SymbolNumber)
        ])
      );
      this.addInfoForm.addControl(
        'pepUnitNo',
        new FormControl(this.addInfoFormValues.pepUnitNo, [
          Validators.pattern(RegexConstants.SymbolNumber)
        ])
      );

      this.addInfoForm.removeControl('pepCity');
      this.addInfoForm.removeControl('pepState');
      this.addInfoForm.removeControl('pepZipCode');
    } else {
      this.addInfoForm.addControl(
        'pepCity',
        new FormControl(this.addInfoFormValues.pepCity, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)
        ])
      );
      this.addInfoForm.addControl(
        'pepState',
        new FormControl(this.addInfoFormValues.pepState, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)
        ])
      );
      this.addInfoForm.addControl(
        'pepZipCode',
        new FormControl(this.addInfoFormValues.pepZipCode, [
          Validators.required,
          Validators.pattern(RegexConstants.NumericOnly)
        ])
      );

      this.addInfoForm.removeControl('pepPostalCode');
      this.addInfoForm.removeControl('pepFloor');
      this.addInfoForm.removeControl('pepUnitNo');
    }
  }

  getDefaultCountry() {
    let defaultCountry;
    if (this.addInfoFormValues.pepCountry) {
      defaultCountry = this.addInfoFormValues.pepCountry;
    } else if (this.isUserNationalitySingapore) {
      defaultCountry = this.investmentAccountService.getCountryFromNationalityCodeByFilter(
        INVESTMENT_ACCOUNT_CONSTANTS.SINGAPORE_NATIONALITY_CODE
      );
    } else {
      defaultCountry = this.investmentAccountService.getCountryFromNationalityCodeByFilter(
        this.addInfoFormValues.nationalityCode
      );
    }
    return defaultCountry;
  }

  observeCountryChange() {
    this.addInfoForm.get('pepCountry').valueChanges.subscribe((value) => {
      this.addOrRemoveAdditionalControls(value);
    });
  }

  observeOccupationChange() {
    this.addInfoForm.get('pepoccupation').valueChanges.subscribe((value) => {
      this.addOtherOccupation(value);
    });
  }

  addOtherOccupation(value) {
    if (
      value.occupation === INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_ONE.OTHERS
    ) {
      this.addInfoForm.addControl(
        'pepOtherOccupation',
        new FormControl(this.addInfoFormValues.pepOtherOccupation, Validators.required)
      );
    } else {
      this.addInfoForm.removeControl('pepOtherOccupation');
    }
  }

  getOccupationList() {
    this.investmentAccountService.getOccupationList().subscribe((data) => {
      this.occupationList = data.objectList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  setOccupationValue(value) {
    this.addInfoForm.controls.pepoccupation.setValue(value);
  }

  setDropDownValue(key, value) {
    this.addInfoForm.controls[key].setValue(value);
  }
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.PEP_DESC;
    return false;
  }
  retrieveAddress(postalCode, address1Control, address2Control) {
    this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe(
      (response: any) => {
        if (response) {
          if (response.Status.code === 200) {
            const address1 =
              response.Placemark[0].AddressDetails.Country.Thoroughfare.ThoroughfareName;
            const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
            address1Control.setValue(address1);
            address2Control.setValue(address2);
          } else {
            const ref = this.modal.open(ErrorModalComponent, { centered: true });
            ref.componentInstance.errorTitle = this.translate.instant(
              'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE'
            );
            ref.componentInstance.errorMessage = this.translate.instant(
              'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC'
            );
            address1Control.setValue('');
            address2Control.setValue('');
          }
        }
      },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant(
          'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE'
        );
        ref.componentInstance.errorMessage = this.translate.instant(
          'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC'
        );
      }
    );
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
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
      this.investmentAccountService.setAdditionalInfoFormData(form.getRawValue());
      this.router.navigate([
        INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2
      ]);
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

  setControlValue(value, controlName, formName) {
    this.investmentAccountService.setControlValue(value, controlName, formName);
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    const content = event.target.innerText;
    if (id !== '') {
      if (content.length >= 100 && id === 'pepFullName') {
        const contentList = content.substring(0, 100);
        this.addInfoForm.controls.pepFullName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      } else if (content.length >= 100 && id === 'cName') {
        const contentList = content.substring(0, 100);
        this.addInfoForm.controls.cName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      }
    }
  }
  showHelpModalCountry() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.tooltipDetails.TITLE;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.tooltipDetails.DESC;
    ref.componentInstance.tooltipButtonLabel = this.tooltipDetails.GOT_IT;
    return false;
  }
}
