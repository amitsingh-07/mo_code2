import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { WillDisclaimerComponent } from '../../shared/components/will-disclaimer/will-disclaimer.component';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
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
  private el: ElementRef;
  promoCode;
  isPromoCodeValid: boolean;
  isDisabled: boolean;
  errorMsg: string;
  @ViewChild('promoCode') promoCodeRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private translate: TranslateService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    private willWritingService: WillWritingService,
    private willWritingApiService: WillWritingApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.INTRODUCTION.PAGE_TITLE');
      this.faqLink = this.translate.instant('WILL_WRITING.INTRODUCTION.FAQ_LINK');
      this.getNowLink = this.translate.instant('WILL_WRITING.INTRODUCTION.GET_ONE_NOW_LINK');
      this.errorMsg = this.translate.instant('WILL_WRITING.INTRODUCTION.PROMO_ERROR');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.authService.authenticate().subscribe((token) => {
    });
    let promoCodeValue: any = this.willWritingService.getPromoCode();
    if (Object.keys(promoCodeValue).length > 0) {
      promoCodeValue = promoCodeValue.toUpperCase();
    } else {
      promoCodeValue = '';
    }
    this.promoCodeForm = this.formBuilder.group({
      promoCode: [promoCodeValue, [Validators.required, Validators.pattern(RegexConstants.SixDigitPromo)]]
    });
    this.footerService.setFooterVisibility(false);
  }

  @HostListener('input', ['$event'])
  onChange() {
    this.promoCodeRef.nativeElement.value = this.promoCodeRef.nativeElement.value.toUpperCase();
  }

  verifyPromoCode(promoCode) {
    promoCode = promoCode.toUpperCase();
    this.isDisabled = true;
    this.willWritingApiService.verifyPromoCode(promoCode).subscribe((data) => {
      this.promoCode = data.responseMessage;
      if (this.promoCode.responseCode === 6005) {
        this.willWritingService.setPromoCode(promoCode);
        this.willWritingService.setEnquiryId(data.objectList[0].enquiryId);
        this.openTermsOfConditions();
      } else if (this.promoCode.responseCode === 5017) {
        this.willWritingService.openToolTipModal('', this.errorMsg);
        this.isDisabled = false;
      } else {
        this.isDisabled = false;
        return false;
      }
    }, (error) => {
      this.isDisabled = false;
    });
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    } else {
      this.verifyPromoCode(form.value.promoCode);
    }
  }

  openFAQ() {
    this.router.navigate(['faq'], {fragment:'will-writing'});
  }

  openTermsOfConditions() {
    const ref = this.modal.open(WillDisclaimerComponent, { centered: true, windowClass: 'full-height-will' });
    ref.result.then((data) => {
      if (data === 'proceed') {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.CHECK_ELIGIBILITY]);
      } else {
        this.isDisabled = false;
      }
    });
  }

  getOneNow() {
    this.router.navigate( ['/home'], {fragment: 'subscribe'});
  }
}
