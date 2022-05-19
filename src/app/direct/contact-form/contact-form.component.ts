import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIGN_UP_CONFIG } from 'src/app/sign-up/sign-up.constant';

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

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
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
  }

  buildForm() {
    this.formObject = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      interedtedInsurance: ['', Validators.required],
      isSmoker: ['', Validators.required],
      pepOtherOccupation: ['', Validators.required],
      enquiry : ['']
    })
  }

  close(userAction: any) {    
    this.activeModal.close(userAction)
  }

  contactMe(){
    this.isSubmitted = true;
  }
}
