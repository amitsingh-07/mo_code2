import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PromotionApiService } from '../../promotion.api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bundle-enquiry',
  templateUrl: './bundle-enquiry.component.html',
  styleUrls: ['./bundle-enquiry.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BundleEnquiryComponent implements OnInit {

  @Input() promoDetails: any;
  showSuccess = false;
  bundleEnquiryForm: FormGroup;
  genderList = ['Male', 'Female'];
  selectedGender: string;
  genderPlaceholder: string;
  formSubmitted = false;
  dobPlaceholder: string;

  constructor(
    public authService: AuthenticationService,
    private promotionApiService: PromotionApiService,
    private formBuilder: FormBuilder,
    private config: NgbDatepickerConfig
  ) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.authService.authenticate().subscribe(() => { });
  }

  ngOnInit() {
    const SINGAPORE_MOBILE_REGEXP = /^(8|9)\d{7}$/;
    this.setPlaceholder();
    this.bundleEnquiryForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(SINGAPORE_MOBILE_REGEXP)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      receiveMarketingEmails: [''],
    });
  }

  selectGender(value: string) {
    this.selectedGender = value;
    this.bundleEnquiryForm.controls['gender'].setValue(value);
  }

  setPlaceholder() {
    this.dobPlaceholder = this.promoDetails.promoId === 15 ? 'Baby’s Date of Birth' : 'Date of Birth';
    this.genderPlaceholder = this.selectedGender = this.promoDetails.promoId === 15 ? 'Baby’s Gender' : 'Gender';
  }

  sendBundleEnquiry(form: any) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    form.value.enquiryType = this.promoDetails.bundle_enquiry_form_type;
    form.value.contactNumber = form.value.contactNumber.toString();
    form.value.receiveMarketingEmails = form.value.receiveMarketingEmails ? 'Yes' : 'No';
    this.formSubmitted = true;
    this.promotionApiService.sendBundleEnquiry(form.value).subscribe(data => {
      if (data.responseMessage.responseCode === 6000) {
        this.bundleEnquiryForm.reset();
        this.setPlaceholder();
        this.showSuccess = true;
      } else {
        this.showSuccess = false;
      }
      this.formSubmitted = false;
    });
  }

}
