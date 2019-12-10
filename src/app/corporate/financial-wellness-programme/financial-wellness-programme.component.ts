import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../../config/config.service';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SeoServiceService } from '../../shared/Services/seo-service.service';
import { CorporateService } from '../corporate.service';
import { IFinancialWellnessProgramme } from './financial-wellness-programme.interface';

@Component({
  selector: 'app-financial-wellness-programme',
  templateUrl: './financial-wellness-programme.component.html',
  styleUrls: ['./financial-wellness-programme.component.scss']
})
export class FinancialWellnessProgrammeComponent implements OnInit {
  financialWellnessForm: FormGroup;
  financialWellnessFormValues: IFinancialWellnessProgramme;
  contactUsErrorMessage: string;
  companySize: any;
  companySizePreset = 'Size Of Company *';
  emailErrorMessage = {};
  ErrorMessage: string;
  financialwellnessFormSent: boolean;
  companySizeItems = [{ 'item': ' Below 300 ' }, { 'item': ' 300 – 1000 ' }, { 'item': ' Above 1000 ' }];

  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public corporateService: CorporateService,
    public translate: TranslateService,
    public authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private seoService: SeoServiceService
  ) {
    this.financialwellnessFormSent = false;
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
      // meta tag and title
      // this.seoService.setTitle(this.translate.instant('CONTACT_US.TITLE'));
      // this.seoService.setBaseSocialMetaTags(this.translate.instant('CONTACT_US.TITLE'),
      //   this.translate.instant('CONTACT_US.META.META_DESCRIPTION'),
      //   this.translate.instant('CONTACT_US.META.META_KEYWORDS')
      // );
    });
    this.financialWellnessFormValues = this.corporateService.getCorporate();
    const SINGAPORE_MOBILE_REGEXP = /^(8|9)\d{7}$/;
    this.financialWellnessForm = new FormGroup({
      firstName: new FormControl(this.financialWellnessFormValues.firstName, [Validators.required]),
      lastName: new FormControl(this.financialWellnessFormValues.lastName, [Validators.required]),
      jobFunction: new FormControl(this.financialWellnessFormValues.jobFunction, [Validators.required]),
      companyName: new FormControl(this.financialWellnessFormValues.companyName, [Validators.required]),
      companySize: new FormControl(this.financialWellnessFormValues.companySize, [Validators.required]),
      email: new FormControl(this.financialWellnessFormValues.email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(this.financialWellnessFormValues.phoneNumber, [Validators.required])
    });
  }

  ngOnInit() {
    this.footerService.setFooterVisibility(true);
    this.companySize = this.companySizePreset;
  }
  selectSize(in_companySize) {
    this.companySize = in_companySize.item;
  }
}
