
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IContactUs } from './contact-us.interface';

import { TranslateService } from '@ngx-translate/core';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { AboutUsApiService } from './../about-us.api.service';
import { AboutUsService } from './../about-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  public subject = 'Choose a Subject*';
  public email = 'enquiry@moneyowl.com.sg';

  contactUsForm: FormGroup;
  contactUsFormValues: IContactUs;
  contactUsErrorMessage: string;
  subjectList: any;
  subjectPreset = 'Choose a Subject*';

  public subjectItems: any;
  sendSuccess = false;

  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public aboutUsService: AboutUsService,
    public aboutUsApiService: AboutUsApiService,
    public translate: TranslateService,
    private formBuilder: FormBuilder
    ) {
      this.aboutUsApiService.getSubjectList().subscribe((data) => {
        this.subjectItems = this.aboutUsService.getSubject(data);
        console.log(this.subjectItems);
      });
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.contactUsErrorMessage = this.translate.instant('ERROR.CONTACT_US.EMPTY_TEXT');
      });
      this.contactUsFormValues = this.aboutUsService.getContactUs();
      this.contactUsForm = new FormGroup({
        subject: new FormControl(this.contactUsFormValues.subject),
        email: new FormControl(this.contactUsFormValues.email),
        message: new FormControl(this.contactUsFormValues.message, [Validators.required])
      });
    }

  ngOnInit() {
    this.sendSuccess = false;
    this.footerService.setFooterVisibility(true);
  }

  selectSubject(in_subject) {
    this.subject = in_subject.subject;
    this.email = in_subject.email;
  }

  save(form: any) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    form.value.subject = this.subject;
    form.value.email = this.email;
    form.value.message = form.value.message.replace(/\n/g, '<br/>').replace(/"/g, '\\"');
    this.aboutUsApiService.setContactUs(form.value).subscribe((data) => {
      console.log(data);
      if (data.responseMessage.responseDescription === 'Successful response') {
        this.sendSuccess = true;
      }
    });
  }
}
