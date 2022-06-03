import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../../sign-up/sign-up.constant';
import { TranslateService } from '@ngx-translate/core';
import { DirectService } from './../direct.service';
import { DirectApiService } from '../direct.api.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { EMAIL_ENQUIRY_SUCCESS } from '../direct-routes.constants';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent implements OnInit {
  formObject: FormGroup;
  isSubmitted = false;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
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
    this.formObject = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(RegexConstants.Email)]],
      mobileNumber: ['', Validators.required],
      dateOfBirth: [''],
      gender: [''],
      insuranceInterestedIn: [''],
      isSmoker: [''],
      anyOtherQueries : [''],
      journeyType : ['insurance-direct']
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
              this.router.navigate([EMAIL_ENQUIRY_SUCCESS]);
            }
          });      
  }

  setDropDownValue(key, value) {
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

  setControlValue(value, controlName) {
    value = value.trim().replace(RegexConstants.trimSpace, ' ');
    if (value !== undefined) {
      value = value.replace(/\n/g, '');
      value = value.substring(0, 300);
      this.formObject.controls[controlName].setValue(value);
      return value;
    }
  }

    // #SET THE CONTROL FOR 300 CHARACTERS LIMIT
  onKeyPressEvent(event: any, content: any) {
      const selection = window.getSelection();
      if (content.length >= 300 && selection.type !== 'Range') {
        const id = event.target.id;
        const el = document.querySelector('#' + id);
        this.setCaratTo(el, 300, content);
        event.preventDefault();
      }
      return (event.which !== 13);
  }

    // #FOR 300 CHARACTERS FIELD CURSOR POSITION
    setCaratTo(contentEditableElement, position, content) {
      contentEditableElement.innerText = content;
      if (document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(contentEditableElement);
  
        range.setStart(contentEditableElement.firstChild, position);
        range.setEnd(contentEditableElement.firstChild, position);
  
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

}
