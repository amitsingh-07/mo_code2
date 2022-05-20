import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from 'src/app/sign-up/sign-up.constant';
import { TranslateService } from '@ngx-translate/core';
import { DirectService } from './../direct.service';

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
  interedtedInsuranceList = [];

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private translate: TranslateService, private directService: DirectService) {
    const today: Date = new Date();
    this.minDate = {
      year: today.getFullYear() - SIGN_UP_CONFIG.ACCOUNT_CREATION.DOB.DATE_PICKER_MAX_YEAR,
      month: today.getMonth() + 1, day: today.getDate()
    };
    this.maxDate = {
      year: today.getFullYear() - SIGN_UP_CONFIG.ACCOUNT_CREATION.DOB.DATE_PICKER_MIN_YEAR,
      month: today.getMonth() + 1, day: today.getDate()
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.interedtedInsuranceList = [
      {id: 1,key: "Bundles",listOrder: 1,name: "Bundles",value: "Bundles"},
      {id: 2,key: "Critical Illness",listOrder: 1,name: "Critical Illness",value: "Critical Illness"},
      {id: 3,key: "Global Medical",listOrder: 1,name: "Global Medical",value: "Global Medical"},
      {id: 4,key: "Local Shield Plans",listOrder: 1,name: "Local Shield Plans",value: "Local Shield Plans"}
    ]
  }

  buildForm() {
    let emailValidators = [
      Validators.required, 
      Validators.email, 
      Validators.pattern(RegexConstants.Email), 
      // this.signUpService.emailDomainValidator(this.organisationEnabled)
    ];
    this.formObject = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', emailValidators],
      mobileNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      interedtedInsurance: ['', Validators.required],
      isSmoker: ['', Validators.required],
      pepOtherOccupation: ['', Validators.required],
      enquiry : ['']
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

  close(userAction: any) {    
    this.activeModal.close(userAction)
  }

  contactMe(){
    this.isSubmitted = true;
  }

  setDropDownValue(key, value, index) {
    this.formObject.controls[key].setValue(value);
  }
}
