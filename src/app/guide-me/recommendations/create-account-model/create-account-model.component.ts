import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { GuideMeService } from '../../guide-me.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';

@Component({
  selector: 'app-create-account-model',
  templateUrl: './create-account-model.component.html',
  styleUrls: ['./create-account-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountModelComponent implements OnInit {
  @Input() data;
  enquiryForm: FormGroup;
  formSubmitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    public signUpService: SignUpService,
    public guideMeService: GuideMeService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeModal.dismiss();
      }
    });
  }

  ngOnInit() {
    this.enquiryForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      lastName: ['', [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      email: ['', [Validators.required, Validators.email]],
      receiveMarketingEmails: ['']
    });
  }

  next(page) {
    this.activeModal.close();
    if (page === 'signup') {
      this.signUpService.clearData();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    }
    if (page === 'login') {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    }
  }

  sendEnquiry(form: any) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    form.value.receiveMarketingEmails = form.value.receiveMarketingEmails ? 'Yes' : 'No';
    this.formSubmitted = true;
  }

}
