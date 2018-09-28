import { AfterViewInit, Component, ElementRef, HostListener, OnInit,
         Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from './../shared/header/header.service';
import { PopupModalComponent } from './../shared/modal/popup-modal/popup-modal.component';
import { NavbarService } from './../shared/navbar/navbar.service';

import { MailchimpApiService } from '../shared/Services/mailchimp.api.service';
import { SubscribeMember } from './../shared/Services/subscribeMember';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  pageTitle: string;
  public firstLoad = true;
  public homeNavBarHide = false;
  public homeNavBarFixed = false;
  public mobileThreshold = 567;
  public navBarElement: ElementRef;
  modalRef: NgbModalRef;

  subscribeForm: FormGroup;
  formValues: SubscribeMember;

  constructor(public headerService: HeaderService, public navbarService: NavbarService, private router: Router,
              public el: ElementRef, private render: Renderer2, private mailChimpApiService: MailchimpApiService,
              public readonly translate: TranslateService, private modal: NgbModal) {
                navbarService.existingNavbar.subscribe((param: ElementRef) => {
                  this.navBarElement = param;
                  this.checkScrollStickyHomeNav();
                });
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {
                    this.pageTitle = this.translate.instant('HOME.TITLE');
                    this.setPageTitle(this.pageTitle);
                });
                if (this.firstLoad) {
                  this.triggerPopup();
                  this.firstLoad = false;
                }
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
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarShadowVisibility(true);
    this.headerService.setHeaderOverallVisibility(false);
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.subscribeForm = new FormGroup({
      email: new FormControl(this.formValues.email),
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  triggerPopup() {
    this.modalRef = this.modal.open(PopupModalComponent, { centered: true, windowClass: 'modal-popup' });
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
    const triggerPosition = window.pageYOffset + (window.outerHeight / 2); // To set the trigger point as center of the screen
    const homeNavBarElement = this.HomeNavBar.nativeElement.getBoundingClientRect();
    const homeNavbarHeight = 0 * ((homeNavBarElement.bottom - homeNavBarElement.top) + 50);
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
      this.render.removeClass(this.HomeNavWill.nativeElement, 'active');
      this.render.addClass(this.HomeNavInsurance.nativeElement, 'active');
    } else
    if (triggerPosition >= OffsetWill[0] && triggerPosition < OffsetWill[1]) {
      // within will
      this.render.removeClass(this.HomeNavInsurance.nativeElement, 'active');
      this.render.removeClass(this.HomeNavInvest.nativeElement, 'active');
      this.render.addClass(this.HomeNavWill.nativeElement, 'active');
    } else
    if (triggerPosition >= OffsetInvest[0] && triggerPosition < OffsetInvest[1]) {
      // within invest
      this.render.removeClass(this.HomeNavComprehensive.nativeElement, 'active');
      this.render.removeClass(this.HomeNavWill.nativeElement, 'active');
      this.render.addClass(this.HomeNavInvest.nativeElement, 'active');
    } else
    if (triggerPosition >= OffsetComprehensive[0] && triggerPosition < OffsetComprehensive[1]) {
      // within comprehensive
      this.render.removeClass(this.HomeNavInvest.nativeElement, 'active');
      this.render.addClass(this.HomeNavComprehensive.nativeElement, 'active');
    }
  }

  goToSection(elementName) {
    const homeNavBarElement = this.HomeNavBar.nativeElement.getBoundingClientRect();
    const homeNavbarHeight = (homeNavBarElement.bottom - homeNavBarElement.top) - 50;
    const selectedSection = elementName.getBoundingClientRect();
    const CurrentOffsetTop = selectedSection.top + window.pageYOffset - homeNavbarHeight;
    window.scrollTo({top: CurrentOffsetTop, behavior: 'smooth' });
  }

  subscribeMember() {
    this.mailChimpApiService.setSubscribeFormData(this.subscribeForm.value, true);
    this.router.navigateByUrl('/about-us/subscribe');
  }
}
