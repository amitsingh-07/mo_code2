import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {
  promoCodeForm: FormGroup;
  errorTitle: string;
  errorMsg: string;
  promoCodeError: string;
  promoCodeMsg: string;
  faqLink: string;
  promoCode;
  pageTitle;
  isPromoCodeValid = false;
  constructor(private formBuilder: FormBuilder, private translate: TranslateService,
              private router: Router, private willWritingService: WillWritingService,
              private willWritingApiService: WillWritingApiService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.INTRODUCTION.PAGE_TITLE');
      this.faqLink = this.translate.instant('WILL_WRITING.INTRODUCTION.FAQ_LINK');
    });
   }

  ngOnInit() {

    this.promoCodeForm = this.formBuilder.group({
      promoCode: ['',  [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]]
    });
  }

  verifyPromoCode(code) {
    // tslint:disable-next-line:no-commented-code
    // this.willWritingApiService.verifyPromoCode(code).subscribe((data) => {
    //   this.promoCode = data;
    //   if (this.promoCodeForm.controls['promoCode'].value === this.promoCode) {
    //     this.isPromoCodeValid = true;
    //   } else {
    //     this.willWritingService.openErrorModal(this.promoCodeError , this.promoCodeMsg);
    //   }
    // }, (error) => {
    //   // this.willWritingService.openErrorModal(this.errorTitle , this.errorMsg);
    // });
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    }
    this.verifyPromoCode(this.promoCodeForm.controls['promoCode'].value);
    this.willWritingService.setPromoCodeDetails(form.value);
    return true;
  }

  openFAQ() {
    window.open(this.faqLink, '_blank');
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.CHECK_ELIGIBILITY]);
    }
  }

}
