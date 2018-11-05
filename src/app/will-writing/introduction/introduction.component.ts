import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { WillDisclaimerComponent } from '../../shared/components/will-disclaimer/will-disclaimer.component';
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
  @ViewChild('promoCode') promoCodeRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private translate: TranslateService,
    public navbarService: NavbarService,
    public authService: AuthenticationService,
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
    this.authService.authenticate().subscribe((token) => {
    });
    this.promoCodeForm = this.formBuilder.group({
      promoCode: ['', [Validators.required, Validators.pattern(RegexConstants.SixDigitPromo)]]
    });
  }

  @HostListener('input', ['$event'])
  onChange() {
    this.promoCodeRef.nativeElement.value = this.promoCodeRef.nativeElement.value.toUpperCase();
  }

  verifyPromoCode(promoCode) {
    this.willWritingApiService.verifyPromoCode(promoCode).subscribe((data) => {
      this.promoCode = data.responseMessage;
      if (this.promoCode.responseCode === 6005) {
        this.openTermsOfConditions();
      } else {
        this.willWritingService.openToolTipModal(this.promoCode.responseDescription, this.promoCode.responseDescription);
      }
    }, (error) => {
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
    window.open(this.faqLink, '_blank');
  }

  openTermsOfConditions() {
    const ref = this.modal.open(WillDisclaimerComponent, { centered: true, windowClass: 'full-height-will' });
    ref.result.then((data) => {
      if (data === 'proceed') {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.CHECK_ELIGIBILITY]);
      }
    });
  }

  getOneNow() {
    window.open(this.getNowLink, '_blank');
  }
}
