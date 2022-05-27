import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../../sign-up/sign-up.constant';
import { TranslateService } from '@ngx-translate/core';
import { DirectService } from './../direct.service';
import { DirectApiService } from '../direct.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent implements OnInit {
  formObject: FormGroup;
  isSubmitted = false;
  formValue: any;
  maxDate: any;
  minDate: any;
  interestedInsuranceInList: string[];

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private translate: TranslateService, private directService: DirectService,
    private directApiService: DirectApiService, private router: Router) {
    const today: Date = new Date();
    this.minDate = {
      year: today.getFullYear() - SIGN_UP_CONFIG.ACCOUNT_CREATION.DOB.DATE_PICKER_MAX_YEAR,
      month: today.getMonth() + 1, day: today.getDate()
    };
    this.maxDate = {
      year: today.getFullYear() - SIGN_UP_CONFIG.ACCOUNT_CREATION.DOB.DATE_PICKER_MIN_YEAR,
      month: today.getMonth() + 1, 
      day: today.getDate()
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.getInterestedInsuranceInList();
  }

  buildForm() {
    let emailValidators = [
      Validators.required, 
      Validators.email, 
      Validators.pattern(RegexConstants.Email)
    ];
    this.formObject = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', emailValidators],
      mobileNumber: ['', Validators.required],
      dateOfBirth: [''],
      gender: [''],
      insuranceInterestedIn: [''],
      isSmoker: [''],
      anyOtherQueries : [''],
      journeyType : ["insurance-direct"]
    })

    this.formObject.get('mobileNumber').valueChanges.subscribe(val => {
      if (!this.formObject.get('mobileNumber').value) {
        this.formObject.get('mobileNumber').setErrors({ required: true });
      } else if (!RegexConstants.MobileNumber.test(this.formObject.get('mobileNumber').value)) {
        this.formObject.get('mobileNumber').setErrors({ mobileRange: true });
      } else {
        this.formObject.get('mobileNumber').setErrors(null);
      }
    })
  }

  closeModal(userAction: string) {
    this.activeModal.close(userAction)
  }

  contactMe() {
    this.isSubmitted = true;
      let payload = this.formObject.value;
      if (payload.dateOfBirth) {
          payload.dateOfBirth = `${payload.dateOfBirth.day}/${payload.dateOfBirth.month}/${payload.dateOfBirth.year}`;
      }
      this.directApiService.directContactMeForm(payload)
        .subscribe(data => {
            if (data.responseMessage.responseCode === 6000) {
              this.closeModal(data.responseMessage.responseDescription);
              this.router.navigate(['email-enquiry/success']);
            }
          });      
  }

  setDropDownValue(key, value, index) {
    this.formObject.controls[key].setValue(value);
  }

  toggleAccordian(event) {
    const formFields = ['dateOfBirth', 'gender', 'insuranceInterestedIn', 'isSmoker'];
    if (event.nextState) {
      this.setValidation(formFields, [Validators.required]);
    } else {
      this.setValidation(formFields);
    }
  }

  setValidation(formFields, validationTypes = null) {
    formFields.forEach(fControl => {
      this.formObject.controls[fControl].setValidators(validationTypes);
      this.formObject.controls[fControl].updateValueAndValidity();
    })
  }

  getInterestedInsuranceInList() {
    this.directApiService.getInterestedInList()
        .subscribe(data => {
            if (data.responseMessage.responseCode === 6000) {
              this.interestedInsuranceInList = data.objectList;
            }
          }); 
  }

}
