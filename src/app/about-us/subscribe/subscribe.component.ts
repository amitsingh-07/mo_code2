import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from './../../shared/header/header.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { MailchimpApiService } from './../../shared/Services/mailchimp.api.service';
import { SubscribeMember } from './../../shared/Services/subscribeMember';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  subscribeForm: FormGroup;
  formValues: SubscribeMember;
  subscribeStatus: any;

  constructor(private navbarService: NavbarService, private headerService: HeaderService, private footerService: FooterService,
              private formBuilder: FormBuilder, private mailChimpApiService: MailchimpApiService) { }

  ngOnInit() {
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.navbarService.setNavbarShadowVisibility(true);
    this.headerService.setHeaderDropshadowVisibility(false);
    this.headerService.setHeaderOverallVisibility(false);

    this.footerService.setFooterVisibility(true);
    this.subscribeForm = new FormGroup({
      email: new FormControl(this.formValues.email),
      firstName: new FormControl(this.formValues.firstName),
      lastName: new FormControl(this.formValues.lastName)
    });
  }

  subscribeMember() {
    this.mailChimpApiService.setSubscribeFormData(this.subscribeForm.value);
  }

}
