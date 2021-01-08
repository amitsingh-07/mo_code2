import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MailchimpApiService } from './../../shared/Services/mailchimp.api.service';
import { FormError } from './../../shared/Services/mailChimpError';
import { WillDisclaimerComponent } from '../../shared/components/will-disclaimer/will-disclaimer.component';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS, WP_WILL_WRITING_ROUTE } from '../will-writing-routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';
import { WillWritingService } from '../will-writing.service';
import { environment } from './../../../environments/environment';
import { APP_ROUTES } from './../../app-routes.constants';
import { SeoServiceService } from './../../shared/Services/seo-service.service';
import { SubscribeMember } from './../../shared/Services/subscribeMember';

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

  subscribeForm: FormGroup;
  subscribeMessage = '';
  subscribeSuccess = false;
  formValues: SubscribeMember;
  public emailPattern = '^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
  private formError: any = new FormError();
  @ViewChild('subscribeSection') SubscribeSection: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    private willWritingService: WillWritingService,
    private willWritingApiService: WillWritingApiService,
    private seoService: SeoServiceService,
    private mailChimpApiService: MailchimpApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.INTRODUCTION.PAGE_TITLE');
      this.faqLink = this.translate.instant('WILL_WRITING.INTRODUCTION.FAQ_LINK');
      this.getNowLink = this.translate.instant('WILL_WRITING.INTRODUCTION.GET_ONE_NOW_LINK');
      this.errorMsg = this.translate.instant('WILL_WRITING.INTRODUCTION.PROMO_ERROR');
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('WILL_WRITING.INTRODUCTION.META.META_TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('WILL_WRITING.INTRODUCTION.META.META_TITLE'),
        this.translate.instant('WILL_WRITING.INTRODUCTION.META.META_DESCRIPTION'),
        this.translate.instant('WILL_WRITING.INTRODUCTION.META.META_KEYWORDS'));
    });

    this.mailChimpApiService.newSubscribeMessage.subscribe((data) => {
      if (data !== '') {
        if (data.match('verification link')) {
          this.subscribeSuccess = true;
          this.subscribeMessage = data;
        } else {
          this.subscribeMessage = data;
          this.subscribeSuccess = false;
        }
      }
    });

    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.goToSubcribeForm();
      }
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

    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.subscribeForm = new FormGroup({
      firstName: new FormControl(this.formValues.firstName),
      lastName: new FormControl(this.formValues.lastName),
      email: new FormControl(this.formValues.email, [Validators.required, Validators.pattern(this.emailPattern)]),
    });
    this.subscribeForm.valueChanges.subscribe(() => {
      this.subscribeMessage = '';
      this.subscribeSuccess = false;
    });
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

  goToSubcribeForm() {
      this.SubscribeSection.nativeElement.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
  }

  subscribeMember() {
    if (this.subscribeForm.valid) {
      this.mailChimpApiService.registerUser(this.subscribeForm.value);
    } else {
      this.subscribeSuccess = false;
      this.subscribeMessage = this.formError.subscribeFormErrors.INVALID.errorMessage;
    }
  }

  getPromoCode() {
    if (environment.hideHomepage) {
      window.open(WP_WILL_WRITING_ROUTE.MAILING_LIST, '_blank');
    } else {
      this.router.navigate([APP_ROUTES.HOME], {fragment: 'subscribe'});
    }
  }
}
