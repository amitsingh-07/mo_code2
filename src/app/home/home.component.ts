import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MailchimpApiService } from '../shared/Services/mailchimp.api.service';
import { AppService } from './../app.service';
import { FooterService } from './../shared/footer/footer.service';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { NavbarService } from './../shared/navbar/navbar.service';
import { SubscribeMember } from './../shared/Services/subscribeMember';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit, AfterViewInit {
  pageTitle: string;
  trustedSubTitle: any;
  trustedReasons: any;
  public homeNavBarHide = false;
  public homeNavBarFixed = false;
  public mobileThreshold = 567;
  public initLoad = true;
  public navBarElement: ElementRef;
  modalRef: NgbModalRef;

  subscribeForm: FormGroup;
  formValues: SubscribeMember;

  constructor(
    public navbarService: NavbarService, public footerService: FooterService, carouselConfig: NgbCarouselConfig,
    public el: ElementRef, private render: Renderer2, private mailChimpApiService: MailchimpApiService,
    public readonly translate: TranslateService, private modal: NgbModal, private router: Router,
    private route: ActivatedRoute, private authService: AuthenticationService, private appService: AppService) {
    carouselConfig.showNavigationArrows = true;
    carouselConfig.showNavigationIndicators = true;
    carouselConfig.wrap = false;
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
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('HOME.TITLE');
      this.trustedSubTitle = this.translate.instant('TRUSTED.SUB_TITLE');
      this.trustedReasons = this.translate.instant('TRUSTED.REASONS');
      this.setPageTitle(this.pageTitle);
      this.navbarService.setNavbarVisibility(true);
      this.navbarService.setNavbarMode(1);
      this.navbarService.setNavbarMobileVisibility(true);
      this.navbarService.setNavbarShadowVisibility(true);
      this.footerService.setFooterVisibility(true);
    });
  }

  @ViewChild('banner') BannerElement: ElementRef;
  @ViewChild('homeNavBar') HomeNavBar: ElementRef;
  @ViewChild('subscribeFooter') SubscribeFooter: ElementRef;

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
    this.navbarService.getNavbarDetails();
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.render.addClass(this.HomeNavInsurance.nativeElement, 'active');
    this.subscribeForm = new FormGroup({
      email: new FormControl(this.formValues.email),
    });
    this.authService.clearSession();
    this.appService.startAppSession();
  }

  ngAfterViewInit() {
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToRoute(fragment) {
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
      this.render.removeClass(this.HomeNavInsurance.nativeElement, 'active');
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
      window.scrollTo({top: CurrentOffsetTop, behavior: 'smooth'});
    } else {
      setTimeout( () => {
        elementName.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      }, 0);
    }
  }

  subscribeMember() {
    this.mailChimpApiService.setSubscribeFormData(this.subscribeForm.value, true);
    this.router.navigateByUrl('/about-us/subscribe');
  }
}
