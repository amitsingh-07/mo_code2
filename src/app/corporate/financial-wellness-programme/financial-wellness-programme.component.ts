import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../../config/config.service';
import { FooterService } from '../../shared/footer/footer.service';
import { CorporateService } from '../corporate.service';

@Component({
  selector: 'app-financial-wellness-programme',
  templateUrl: './financial-wellness-programme.component.html',
  styleUrls: ['./financial-wellness-programme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialWellnessProgrammeComponent implements OnInit {
  financialWellnessForm: FormGroup;
  submitted = false;
  sendSuccess = false;
  companySize: any;
  companySizePreset = 'Size Of Company *';
  emailErrorMessage = {};
  ErrorMessage: string;
  companySizeItems = [{ item: 'Below 300' }, { item: '300 – 1000' }, { item: 'Above 1000' }];

  constructor(
    public footerService: FooterService,
    public corporateService: CorporateService,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private configService: ConfigService
  ) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.ErrorMessage = this.translate.instant('ERROR.CONTACT_US.ALL_FIELDS');
      this.emailErrorMessage = {
        required: this.translate.instant('ERROR.CONTACT_US.EMAIL_REQUIRED'),
        email: this.translate.instant('ERROR.CONTACT_US.EMAIL_PATTERN')
      };
    });
  }

  ngOnInit() {
    this.footerService.setFooterVisibility(true);
    this.companySize = this.companySizePreset;
    this.buildFinancialWellnessForm();
  }

  buildFinancialWellnessForm() {
    this.financialWellnessForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobFunction: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companySize: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]]
    });
  }

  selectSize(in_companySize) {
    this.companySize = in_companySize.item;
  }

  save(form: any) {
    this.submitted = true;
    form.value.enquiryType = 'Corporate Business';
    form.value.companySize = this.companySize;
    if (form.valid) {
      this.corporateService.saveEnquiryForm(form.value).subscribe((data: any) => {
        if (data.responseMessage.responseCode === 6000) {
          this.sendSuccess = true;
          this.submitted = false;
          this.financialWellnessForm.reset();
          this.companySize = this.companySizePreset;
        } else {
          this.sendSuccess = false;
          this.submitted = false;
        }
      });
    }
  }
}
