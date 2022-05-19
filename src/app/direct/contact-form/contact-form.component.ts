import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent implements OnInit {
  formObject: FormGroup;
  isSubmitted = false;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

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
    })
  }

  close(userAction: any) {    
    this.activeModal.close(userAction)
  }

  contactMe(){
    this.isSubmitted = true;
  }
}
