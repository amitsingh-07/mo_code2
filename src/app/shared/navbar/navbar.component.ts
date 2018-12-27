import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';

import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService, IConfig } from './../../config/config.service';
import { SignUpService } from './../../sign-up/sign-up.service';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})

export class NavbarComponent implements OnInit, AfterViewInit {
  showMobileNavbar = false;
  navbarMode: number;
  showNavShadow: boolean;
  showSearchBar = false;

  pageTitle: string;
  subTitle = '';
  helpIcon = false;
  closeIcon = false;
  settingsIcon = false;
  currentUrl: string;
  backListener = '';
  isBackPressSubscribed = false;

  innerWidth: any;
  mobileThreshold = 567;
  isNavbarCollapsed = true;

  isWillWritingEnabled = false;
  isInvestmentEnabled = true;
  isComprehensiveEnabled = true;

  isLoggedIn = false;
  userInfo;

  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;
  constructor(
    private navbarService: NavbarService, private _location: Location,
    private config: NgbDropdownConfig, private renderer: Renderer2,
    private cdr: ChangeDetectorRef, private router: Router, private configService: ConfigService,
    private signUpService: SignUpService, private authService: AuthenticationService,
    private appService: AppService) {
    config.autoClose = true;
    this.navbarService.getNavbarEvent.subscribe((data) => {
      this.navbarService.setNavbarDetails(this.NavBar);
    });

    this.configService.getConfig().subscribe((moduleConfig: IConfig) => {
      this.isWillWritingEnabled = moduleConfig.willWritingEnabled;
      this.isInvestmentEnabled = moduleConfig.investmentEnabled;
      this.isComprehensiveEnabled = moduleConfig.comprehensiveEnabled;
    });

    this.userInfo = this.signUpService.getUserProfileInfo();
    if (this.userInfo && this.userInfo.firstName) {
      this.isLoggedIn = true;
    }

    this.signUpService.userObservable$.subscribe((data) => {
      if (data) {
        if (data === 'LOGGED_OUT') {
          this.isLoggedIn = false;
          this.clearLoginDetails();
        } else {
          this.userInfo = data;
          if (this.userInfo && this.userInfo.firstName) {
            this.isLoggedIn = true;
          }
        }
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', [])
  checkScroll() { // Emiting Navbar Details to Navbar Service
    this.navbarService.setNavbarDetails(this.NavBar);
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.hideMenu();
    this.innerWidth = window.innerWidth;
    this.navbarService.currentPageTitle.subscribe((title) => this.pageTitle = title);
    this.navbarService.currentPageSubTitle.subscribe((subTitle) => this.subTitle = subTitle);
    this.navbarService.currentPageHelpIcon.subscribe((helpIcon) => this.helpIcon = helpIcon);
    this.navbarService.currentPageProdInfoIcon.subscribe((closeIcon) => this.closeIcon = closeIcon);
    this.navbarService.currentPageSettingsIcon.subscribe((settingsIcon) => this.settingsIcon = settingsIcon);
    this.navbarService.isBackPressSubscribed.subscribe((subscribed) => {
      this.isBackPressSubscribed = subscribed;
    });

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url !== this.currentUrl) {
          this.currentUrl = this.router.url;
          this.hideMenu();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.navbarService.currentNavbarMobileVisibility.subscribe((showMobileNavbar) => {
      this.showMobileNavbar = showMobileNavbar;
    });
    this.navbarService.currentNavbarMode.subscribe((navbarMode) => {
      this.navbarMode = navbarMode;
      this.cdr.detectChanges();
    });
    this.navbarService.currentNavbarShadowVisibility.subscribe((showNavShadow) => {
      this.showNavShadow = showNavShadow;
      this.cdr.detectChanges();
    });
  }

  openSearchBar(toggle: boolean) {
    this.showSearchBar = toggle;
  }

  showMobilePopUp() {
    this.navbarService.showMobilePopUp(this.pageTitle);
  }

  goBack() {
    if (this.isBackPressSubscribed) {
      this.navbarService.backPressed(this.pageTitle);
    } else {
      this._location.back();
    }
  }

  openDropdown(dropdown) {
    if (this.innerWidth > this.mobileThreshold) {
      dropdown.open();
    }
  }

  closeDropdown(dropdown) {
    if (this.innerWidth > this.mobileThreshold) {
      dropdown.close();
    }
  }

  hideMenu() {
    this.isNavbarCollapsed = true;
  }

  logout() {
    this.authService.logout().subscribe((data) => {
      this.clearLoginDetails();
    });
  }

  clearLoginDetails() {
    this.signUpService.setUserProfileInfo(null);
    this.isLoggedIn = false;
    this.appService.clearData();
    this.appService.startAppSession();
    this.router.navigate([appConstants.homePageUrl]);
  }
}
