import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { WillDisclaimerComponent } from '../../shared/components/will-disclaimer/will-disclaimer.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
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
  pageTitle: string;

  promoCodeForm: FormGroup;
  faqLink: string;
  getNowLink: string;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private translate: TranslateService,
    public navbarService: NavbarService,
    private willWritingService: WillWritingService,
    private willWritingApiService: WillWritingApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.INTRODUCTION.PAGE_TITLE');
      this.faqLink = this.translate.instant('WILL_WRITING.INTRODUCTION.FAQ_LINK');
      this.getNowLink = this.translate.instant('WILL_WRITING.INTRODUCTION.GET_ONE_NOW_LINK');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.promoCodeForm = this.formBuilder.group({
      promoCode: ['', [Validators.required, Validators.pattern(RegexConstants.SixDigitPromo)]]
    });
  }

  verifyPromoCode() {
    const promoCode = this.promoCodeForm.controls['promoCode'].value;
    this.willWritingService.setPromoCode(promoCode);
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.CHECK_ELIGIBILITY]);
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
    } else {
      this.openTermsOfConditions();
    }
  }

  openFAQ() {
    window.open(this.faqLink, '_blank');
  }

  openTermsOfConditions() {
    const ref = this.modal.open(WillDisclaimerComponent, { centered: true, windowClass: 'full-height-will' });
    ref.result.then((data) => {
      if (data === 'proceed') {
        this.verifyPromoCode();
      }
    });
  }

  getOneNow() {
    window.open(this.getNowLink, '_blank');
  }
}
