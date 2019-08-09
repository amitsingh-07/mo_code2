import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmploymentDetailsComponent implements OnInit {
  pageTitle: string;
  employementStatusList: any;
  employementDetailsForm: FormGroup;
  formValues: any;
  countries: any;
  isUserNationalitySingapore;
  occupation;
  industry: any;
  empStatus: any;
  industryList;
  occupationList;
  isEditProfile: any;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private investmentAccountService: InvestmentAccountService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('EMPLOYMENT_DETAILS.TITLE');
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
    this.getOccupationList();
    this.getIndustryList();
    this.getEmployeList();
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    // Set employment status in MyInfo
    if (this.formValues.isMyInfoEnabled) {
      this.setEmploymentStatus();
    }
    this.isEditProfile =
      this.route.snapshot.queryParams && this.route.snapshot.queryParams.enableEditProfile
        ? true
        : false;
    this.employementDetailsForm = this.buildForm();
    this.addOrRemoveAdditionalControls(
      this.employementDetailsForm.get('employmentStatus').value
    );
    this.observeEmploymentStatusChange();
    this.addOrRemoveMailingAddress(
      this.employementDetailsForm.get('employmentStatus').value
    );
    if (this.employementDetailsForm.get('employeaddress')) {
      this.observeEmpAddressCountryChange();
    }
    this.investmentAccountService.loadInvestmentAccountRoadmap();
  }

  buildForm() {
    return this.formBuilder.group({
      employmentStatus: [this.formValues.employmentStatus, Validators.required]
    });
  }

  setEmploymentStatus() {
    if (this.formValues.companyName) {
      this.formValues.employmentStatus = INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.EMPLOYED;
    } else {
      this.formValues.employmentStatus = INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.UNEMPLOYED;
    }
  }

  addOrRemoveAdditionalControls(empStatus) {
    if (
      empStatus === INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.SELE_EMPLOYED ||
      empStatus === INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.EMPLOYED
    ) {
      this.employementDetailsForm.addControl(
        'companyName',
        new FormControl(
          {
            value: this.formValues.companyName,
            disabled: this.investmentAccountService.isDisabled('companyName')
          },
          [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSymbol)]
        )
      );
      this.employementDetailsForm.addControl(
        'occupation',
        new FormControl(this.formValues.occupation, Validators.required)
      );
      this.employementDetailsForm.addControl(
        'industry',
        new FormControl(this.formValues.industry, Validators.required)
      );
      this.employementDetailsForm.addControl(
        'contactNumber',
        new FormControl(this.formValues.contactNumber, [
          Validators.required,
          Validators.pattern(RegexConstants.ContactNumber)
        ])
      );
      this.addOrRemoveMailingAddress(empStatus);
      this.observeIndustryChange();
      this.observeOccupationChange();
      if (this.formValues.industry) {
        this.addOtherIndustry(this.formValues.industry);
      }
      if (this.formValues.occupation) {
        this.addOtherOccupation(this.formValues.occupation);
      }
    } else {
      this.employementDetailsForm.removeControl('companyName');
      this.employementDetailsForm.removeControl('occupation');
      this.employementDetailsForm.removeControl('otherOccupation');
      this.employementDetailsForm.removeControl('industry');
      this.employementDetailsForm.removeControl('otherIndustry');
      this.employementDetailsForm.removeControl('contactNumber');
      this.employementDetailsForm.removeControl('employeaddress');
    }
  }

  observeEmploymentStatusChange() {
    this.employementDetailsForm
      .get('employmentStatus')
      .valueChanges.subscribe((value) => {
        this.addOrRemoveAdditionalControls(value);
      });
  }

  getIndustryList() {
    this.investmentAccountService.getIndustryList().subscribe((data) => {
      this.industryList = data.objectList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  getOccupationList() {
    this.investmentAccountService.getOccupationList().subscribe((data) => {
      this.occupationList = data.objectList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  getEmployeList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.employementStatusList = data.objectList.employmentStatus;
      this.investmentAccountService.setEmploymentStatusList(
        data.objectList.employmentStatus
      );
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  setEmpDropDownValue(key, value) {
    setTimeout(() => {
      this.employementDetailsForm.controls[key].setValue(value);
    }, 100);
  }

  setDropDownValue(key, value, nestedKey) {
    setTimeout(() => {
      this.employementDetailsForm.controls[nestedKey]['controls'][key].setValue(value);
    }, 100);
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  addOrRemoveMailingAddress(empStatus) {
    if (
      empStatus === INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.SELE_EMPLOYED ||
      empStatus === INVESTMENT_ACCOUNT_CONFIG.EMPLOYEMENT_DETAILS.EMPLOYED
    ) {
      this.employementDetailsForm.addControl(
        'employeaddress',
        this.formBuilder.group({
          empCountry: [
            this.formValues.empCountry
              ? this.formValues.empCountry
              : this.investmentAccountService.getCountryFromNationalityCode(
                INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE
              ),
            Validators.required
          ],
          empAddress1: [
            this.formValues.empAddress1,
            [
              Validators.required,
              Validators.pattern(RegexConstants.AlphanumericWithSymbol)
            ]
          ],
          empAddress2: [
            this.formValues.empAddress2,
            [Validators.pattern(RegexConstants.AlphanumericWithSymbol)]
          ]
        })
      );
      this.addOrRemoveAdditionalControlsMailing(
        this.employementDetailsForm.get('employeaddress').get('empCountry').value
      );
      this.observeEmpAddressCountryChange();
    } else {
      this.employementDetailsForm.removeControl('employeaddress');
    }
  }

  observeIndustryChange() {
    this.employementDetailsForm.get('industry').valueChanges.subscribe((value) => {
      this.addOtherIndustry(value);
    });
  }

  addOtherIndustry(value) {
    if (value.industry === INVESTMENT_ACCOUNT_CONFIG.OTHERS) {
      this.employementDetailsForm.addControl(
        'otherIndustry',
        new FormControl(this.formValues.otherIndustry, Validators.required)
      );
    } else {
      this.employementDetailsForm.removeControl('otherIndustry');
    }
  }

  observeOccupationChange() {
    this.employementDetailsForm.get('occupation').valueChanges.subscribe((value) => {
      this.addOtherOccupation(value);
    });
  }

  addOtherOccupation(value) {
    if (value.occupation === INVESTMENT_ACCOUNT_CONFIG.OTHERS) {
      this.employementDetailsForm.addControl(
        'otherOccupation',
        new FormControl(
          {
            value: this.formValues.otherOccupation,
            disabled: this.investmentAccountService.isDisabled('otherOccupation')
          },
          Validators.required)
      );
    } else {
      this.employementDetailsForm.removeControl('otherOccupation');
    }
  }

  addOrRemoveAdditionalControlsMailing(country) {
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    const empAddressFormGroup = this.employementDetailsForm.get(
      'employeaddress'
    ) as FormGroup;
    if (isSingapore) {
      empAddressFormGroup.addControl(
        'empPostalCode',
        new FormControl(this.formValues.empPostalCode, [
          Validators.required,
          Validators.pattern(RegexConstants.NumericOnly)
        ])
      );
      empAddressFormGroup.addControl(
        'empFloor',
        new FormControl(
          this.formValues.empFloor,
          Validators.pattern(RegexConstants.SymbolNumber)
        )
      );
      empAddressFormGroup.addControl(
        'empUnitNo',
        new FormControl(
          this.formValues.empUnitNo,
          Validators.pattern(RegexConstants.SymbolNumber)
        )
      );

      empAddressFormGroup.removeControl('empCity');
      empAddressFormGroup.removeControl('empState');
      empAddressFormGroup.removeControl('empZipCode');
    } else {
      empAddressFormGroup.addControl(
        'empCity',
        new FormControl(this.formValues.empCity, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlpha)
        ])
      );
      empAddressFormGroup.addControl(
        'empState',
        new FormControl(this.formValues.empState, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlpha)
        ])
      );
      empAddressFormGroup.addControl(
        'empZipCode',
        new FormControl(this.formValues.empZipCode, [
          Validators.required,
          Validators.pattern(RegexConstants.NumericOnly)
        ])
      );

      empAddressFormGroup.removeControl('empPostalCode');
      empAddressFormGroup.removeControl('empFloor');
      empAddressFormGroup.removeControl('empUnitNo');
    }
  }

  observeEmpAddressCountryChange() {
    this.employementDetailsForm
      .get('employeaddress')
      .get('empCountry')
      .valueChanges.subscribe((value) => {
        this.addOrRemoveAdditionalControlsMailing(value);
      });
  }

  retrieveAddress(postalCode, address1Control, address2Control) {
    if (postalCode) {
      this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe(
        (response: any) => {
          if (response) {
            if (response.Status.code === 200) {
              const address1 =
                response.Placemark[0].AddressDetails.Country.Thoroughfare
                  .ThoroughfareName;
              const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
              address1Control.setValue(address1);
              address2Control.setValue(address2);
            } else {
              const ref = this.modal.open(ErrorModalComponent, { centered: true });
              ref.componentInstance.errorTitle = this.translate.instant(
                'EMPLOYMENT_DETAILS.POSTALCODE_NOT_FOUND_ERROR.TITLE'
              );
              ref.componentInstance.errorMessage = this.translate.instant(
                'EMPLOYMENT_DETAILS.POSTALCODE_NOT_FOUND_ERROR.MESSAGE'
              );
              address1Control.setValue('');
              address2Control.setValue('');
            }
          }
        },
        (err) => {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant(
            'EMPLOYMENT_DETAILS.ERROR.POSTAL_CODE_TITLE'
          );
          ref.componentInstance.errorMessage = this.translate.instant(
            'EMPLOYMENT_DETAILS.ERROR.POSTAL_CODE_DESC'
          );
        }
      );
    } else {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant(
        'EMPLOYMENT_DETAILS.POSTALCODE_EMPTY_ERROR.TITLE'
      );
      ref.componentInstance.errorMessage = this.translate.instant(
        'EMPLOYMENT_DETAILS.POSTALCODE_EMPTY_ERROR.MESSAGE'
      );
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
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      if (this.isEditProfile) {
        this.investmentAccountService
          .updateEmployerAddress(form.getRawValue())
          .subscribe((data) => {
            if (data.responseMessage.responseCode === 6000) {
              // tslint:disable-next-line:max-line-length
              this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
            }
          },
            (err) => {
              this.investmentAccountService.showGenericErrorModal();
            });
      } else {
        this.investmentAccountService.setEmployeAddressFormData(form.getRawValue());
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS]);
      }
    }
  }

  isDisabled(fieldName) {
    return this.investmentAccountService.isDisabled(fieldName);
  }

  setControlValue(value, controlName, formName) {
    this.investmentAccountService.setControlValue(value, controlName, formName);
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event , content);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id !== '') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const contentList = content.substring(0, 100);
        this.employementDetailsForm.controls.companyName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      }
    }
  }
}
