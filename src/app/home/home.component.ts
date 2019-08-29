import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DirectService } from './../direct/direct.service';

import { APP_ROUTES } from '../app-routes.constants';
import { GuideMeService } from '../guide-me/guide-me.service';
import { MailchimpApiService } from '../shared/Services/mailchimp.api.service';
import { FormError } from '../shared/Services/mailChimpError';
import { AppService } from './../app.service';
import { ConfigService, IConfig } from './../config/config.service';
import { DIRECT_BASE_ROUTE } from './../direct/direct-routes.constants';
import { FooterService } from './../shared/footer/footer.service';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { NavbarService } from './../shared/navbar/navbar.service';
import { SeoServiceService } from './../shared/Services/seo-service.service';
import { StateStoreService } from './../shared/Services/state-store.service';
import { SubscribeMember } from './../shared/Services/subscribeMember';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit, AfterViewInit {
  private formError: any = new FormError();
  pageTitle: string;
  trustedSubTitle: any;
  trustedReasons: any;
  public homeNavBarHide = false;
  public homeNavBarFixed = false;
  public mobileThreshold = 567;
  public initLoad = true;
  public navBarElement: ElementRef;
  public emailPattern = '^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
  modalRef: NgbModalRef;

  subscribeForm: FormGroup;
  subscribeMessage = '';
  subscribeSuccess = false;
  formValues: SubscribeMember;
  isWillWritingEnabled = false;
  isInvestmentEnabled = true;
  isComprehensiveEnabled = true;
  isSrsEnabled = false;
  isMarqueeEnabled = false;
  srsPromoText = '';
  marqueePromoText = '';

  constructor(
    public navbarService: NavbarService, public footerService: FooterService, private meta: Meta, private title: Title,
    public el: ElementRef, private render: Renderer2, private mailChimpApiService: MailchimpApiService,
    public readonly translate: TranslateService, private modal: NgbModal, private router: Router, private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, private authService: AuthenticationService, private appService: AppService,
    private seoService: SeoServiceService, private configService: ConfigService, private stateStoreService: StateStoreService,
    private directService: DirectService, private guidemeService: GuideMeService) {
    navbarService.existingNavbar.subscribe((param: ElementRef) => {
      this.navBarElement = param;
      this.checkScrollStickyHomeNav();
      if (this.initLoad) {
        route.fragment.subscribe((fragment) => {
          if (fragment) {
            this.goToRoute(fragment);
          }
        });
        this.initLoad = false;
      }
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.trustedSubTitle = this.translate.instant('TRUSTED.SUB_TITLE');
      this.trustedReasons = this.translate.instant('TRUSTED.REASONS');
      this.srsPromoText = this.translate.instant('BANNER.SRS_PROMO.SUB_CONTENT');
      this.marqueePromoText = this.translate.instant('BANNER.MARQUEE_PROMO.CONTENT');
      this.setPageTitle(this.pageTitle);
      // Navbar Service
      this.navbarService.setNavbarVisibility(true);
      this.navbarService.setNavbarMode(1);
      this.navbarService.setNavbarMobileVisibility(false);
      this.navbarService.setNavbarShadowVisibility(true);
      this.footerService.setFooterVisibility(true);
    });

    this.translate.get('HOME').subscribe((result: string) => {
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('GENERAL.TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('GENERAL.TITLE'),
        this.translate.instant('GENERAL.META.META_DESCRIPTION'),
        this.translate.instant('GENERAL.META.META_KEYWORDS'));
      this.meta.addTag({ name: 'copyright', content: this.translate.instant('GENERAL.META.META_COPYRIGHT') });
    });

    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isWillWritingEnabled = config.willWritingEnabled;
      this.isInvestmentEnabled = config.investmentEnabled;
      this.isComprehensiveEnabled = config.comprehensiveEnabled;
      this.isSrsEnabled = config.srsEnabled;
      this.isMarqueeEnabled = config.marqueeEnabled;
    });

    this.mailChimpApiService.newSubscribeMessage.subscribe((data) => {
      if (data !== '') {
        console.log(data);
        if (data.match('verification link')) {
          this.subscribeSuccess = true;
          this.subscribeMessage = data;
        } else {
          this.subscribeMessage = data;
          this.subscribeSuccess = false;
        }
      }
    });
  }

  @ViewChild('banner') BannerElement: ElementRef;
  @ViewChild('homeNavBar') HomeNavBar: ElementRef;
  @ViewChild('subscribeFooter') SubscribeFooter: ElementRef;
  @ViewChild('subscribeSection') SubscribeSection: ElementRef;
  /* Child Elements for Home NavBar */
  @ViewChild('homeNavInsurance') HomeNavInsurance: ElementRef;
  @ViewChild('homeNavWill') HomeNavWill: ElementRef;
  @ViewChild('homeNavInvest') HomeNavInvest: ElementRef;
  @ViewChild('homeNavComprehensive') HomeNavComprehensive: ElementRef;

  /* Child Elements for Section */
  @ViewChild('insurance') InsuranceElement: ElementRef;
  @ViewChild('will') WillElement: ElementRef;
  @ViewChild('investment') InvestElement: ElementRef;
  @ViewChild('comprehensive') ComprehensiveElement: ElementRef;

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', [])
  checkScroll() {
    this.checkScrollHomeNav();
  }

  ngOnInit() {
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.render.addClass(this.HomeNavInsurance.nativeElement, 'active');
    this.subscribeForm = new FormGroup({
      firstName: new FormControl(this.formValues.firstName),
      lastName: new FormControl(this.formValues.lastName),
      email: new FormControl(this.formValues.email, [Validators.required, Validators.pattern(this.emailPattern)]),
    });
    this.subscribeForm.valueChanges.subscribe(() => {
      this.subscribeMessage = '';
      this.subscribeSuccess = false;
    });
    //this.authService.clearSession();
    this.appService.clearJourneys();
    this.appService.startAppSession();
  }

  ngAfterViewInit() {
    this.navbarService.getNavbarDetails();
    this.cdr.detectChanges();
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        setTimeout(() => {
          this.goToRoute(params['category']);
        }, 500);
      }
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToRoute(fragment) {
    if (fragment === 'subscribe') {
      this.goToSection(this.SubscribeSection.nativeElement);
    } else
      if (fragment === 'insurance') {
        this.goToSection(this.InsuranceElement.nativeElement);
      } else
        if (fragment === 'will') {
          this.goToSection(this.WillElement.nativeElement);
        } else
          if (fragment === 'invest') {
            this.goToSection(this.InvestElement.nativeElement);
          } else
            if (fragment === 'comprehensive') {
              this.goToSection(this.ComprehensiveElement.nativeElement);
            }
  }

  checkScrollStickyHomeNav() {
    const navbarElement = this.navBarElement.nativeElement.getBoundingClientRect();
    const bannerElement = this.BannerElement.nativeElement.getBoundingClientRect();
    const homeNavBarElement = this.HomeNavBar.nativeElement.getBoundingClientRect();
    const subscribeFooter = this.SubscribeFooter.nativeElement.getBoundingClientRect();

    const navbarTop = navbarElement.top + window.pageYOffset - document.documentElement.clientTop;
    const navbarBottom = navbarElement.bottom + window.pageYOffset - document.documentElement.clientTop;
    const BannerBottom = bannerElement.bottom + window.pageYOffset - document.documentElement.clientTop;
    const homeNavBarHeight = homeNavBarElement.bottom - homeNavBarElement.top;
    const homeNavBarPosition = homeNavBarElement.bottom + window.pageYOffset - document.documentElement.clientTop;
    const endTriggerPosition = subscribeFooter.bottom + window.pageYOffset - document.documentElement.clientTop;

    /* Top Check */
    if (navbarBottom < (endTriggerPosition)) {
      if (BannerBottom < navbarBottom) {
        this.homeNavBarFixed = true;
      } else
        if (BannerBottom > navbarBottom) {
          this.homeNavBarFixed = false;
        }
      /* Bottom Check */
      if (homeNavBarPosition > endTriggerPosition) {
        this.homeNavBarHide = true;
      }
    }
    if (navbarBottom < (endTriggerPosition - homeNavBarHeight)) {
      this.homeNavBarHide = false;
    }
  }

  checkScrollHomeNav() {
    let difference = 0;
    const homeNavBarElement = this.HomeNavBar.nativeElement.getBoundingClientRect();
    const homeNavbarHeight = (homeNavBarElement.bottom - homeNavBarElement.top);
    const navbarElement = this.navBarElement.nativeElement.getBoundingClientRect();
    const navbarHeight = (navbarElement.bottom - navbarElement.top);
    if (this.homeNavBarFixed) {
      difference = homeNavbarHeight + navbarHeight;
    }
    let triggerPosition = window.pageYOffset - document.documentElement.clientTop + difference + ((window.outerHeight - difference) / 2);
    // To set the trigger point as center of the screen
    if (innerWidth > this.mobileThreshold) {
      triggerPosition = homeNavBarElement.bottom + window.pageYOffset - document.documentElement.clientTop;
    }

    const insuranceElement = this.InsuranceElement.nativeElement.getBoundingClientRect();
    const OffsetInsurance = [insuranceElement.top + window.pageYOffset - document.documentElement.clientTop,
    insuranceElement.bottom + window.pageYOffset - document.documentElement.clientTop];
    const willElement = this.WillElement.nativeElement.getBoundingClientRect();
    const OffsetWill = [willElement.top + window.pageYOffset - document.documentElement.clientTop,
    willElement.bottom + window.pageYOffset - document.documentElement.clientTop];
    const investElement = this.InvestElement.nativeElement.getBoundingClientRect();
    const OffsetInvest = [investElement.top + window.pageYOffset - document.documentElement.clientTop,
    investElement.bottom + window.pageYOffset - document.documentElement.clientTop];
    const comprehensiveElement = this.ComprehensiveElement.nativeElement.getBoundingClientRect();
    const OffsetComprehensive = [comprehensiveElement.top + window.pageYOffset - document.documentElement.clientTop,
    comprehensiveElement.bottom + window.pageYOffset - document.documentElement.clientTop];

    if (triggerPosition >= OffsetInsurance[0] && triggerPosition < OffsetInsurance[1]) {
      // within insurance
      this.render.removeClass(this.HomeNavInvest.nativeElement, 'active');
      this.render.removeClass(this.HomeNavComprehensive.nativeElement, 'active');
      this.render.removeClass(this.HomeNavWill.nativeElement, 'active');
      this.render.addClass(this.HomeNavInsurance.nativeElement, 'active');
    } else
      if (triggerPosition >= OffsetWill[0] && triggerPosition < OffsetWill[1]) {
        // within will
        this.render.removeClass(this.HomeNavComprehensive.nativeElement, 'active');
        this.render.removeClass(this.HomeNavInsurance.nativeElement, 'active');
        this.render.removeClass(this.HomeNavInvest.nativeElement, 'active');
        this.render.addClass(this.HomeNavWill.nativeElement, 'active');
      } else
        if (triggerPosition >= OffsetInvest[0] && triggerPosition < OffsetInvest[1]) {
          // within invest
          this.render.removeClass(this.HomeNavInsurance.nativeElement, 'active');
          this.render.removeClass(this.HomeNavComprehensive.nativeElement, 'active');
          this.render.removeClass(this.HomeNavWill.nativeElement, 'active');
          this.render.addClass(this.HomeNavInvest.nativeElement, 'active');
        } else
          if (triggerPosition >= OffsetComprehensive[0] && triggerPosition < OffsetComprehensive[1]) {
            // within comprehensive
            this.render.removeClass(this.HomeNavInsurance.nativeElement, 'active');
            this.render.removeClass(this.HomeNavInvest.nativeElement, 'active');
            this.render.removeClass(this.HomeNavWill.nativeElement, 'active');
            this.render.addClass(this.HomeNavComprehensive.nativeElement, 'active');
          }
  }

  goToSection(elementName) {
    const homeNavBarElement = this.HomeNavBar.nativeElement.getBoundingClientRect();
    const homeNavbarHeight = (homeNavBarElement.bottom - homeNavBarElement.top);
    const navbarElement = this.navBarElement.nativeElement.getBoundingClientRect();
    const navbarHeight = (navbarElement.bottom - navbarElement.top);
    const selectedSection = elementName.getBoundingClientRect();

    const CurrentOffsetTop = selectedSection.top + window.pageYOffset - document.documentElement.clientTop
      - homeNavbarHeight - navbarHeight + 10;

    if (innerWidth > this.mobileThreshold) {
      const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
      if (!isIEOrEdge) {
        window.scrollTo({ top: CurrentOffsetTop, behavior: 'smooth' });
      } else {
        elementName.scrollIntoView(true);
      }
    } else {
      elementName.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    }
  }
  openNewTab(url) {
    window.open(url, '_blank');
  }
  startGuidedJourney() {
    if (!this.authService.isSignedUser()) {
      this.guidemeService.clearServiceData();
    }
    this.stateStoreService.clearAllStates();
    this.router.navigate([APP_ROUTES.GUIDE_ME]);
  }

  startDirectJourney() {
    this.stateStoreService.clearAllStates();
    this.directService.clearServiceData();
    this.router.navigate([DIRECT_BASE_ROUTE]);
  }

  subscribeMember() {
    if (this.subscribeForm.valid) {
      this.mailChimpApiService.registerUser(this.subscribeForm.value);
    } else {
      this.subscribeSuccess = false;
      this.subscribeMessage = this.formError.subscribeFormErrors.INVALID.errorMessage;
    }
  }
}
