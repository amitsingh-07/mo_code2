import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IContactUs } from './contact-us.interface';

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
  public subject = 'Subject';

  contactUsForm: FormGroup;
  contactUsFormValues: IContactUs;

  public subjectItems = ['Tell us how we are doing', 'Interested in Financial Planning', 'Looking for a product', 'How to make a claim'];
  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public aboutUsService: AboutUsService,
    public aboutUsApiService: AboutUsApiService,
    private formBuilder: FormBuilder
    ) {

    }

  ngOnInit() {
    this.footerService.setFooterVisibility(true);

    this.contactUsFormValues = this.aboutUsService.getContactUs();
    this.contactUsForm = new FormGroup({
      subject: new FormControl(this.contactUsFormValues.subject),
      message: new FormControl(this.contactUsFormValues.message, [Validators.required])
    });
  }

  save(form: any) {
    console.log(form);
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    form.value.subject = this.subject;

    this.aboutUsApiService.setContactUs(form.value).subscribe((data) => {
      if (data) {
        console.log('success');
      }
    });
  }

  selectSubject(subject: string) {
    this.subject = subject;
  }
}
