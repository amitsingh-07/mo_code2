import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

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

  innerWidth: any;
  mobileThreshold = 567;
  isNavbarCollapsed = true;
  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;

  constructor(private navbarService: NavbarService, private _location: Location,
              private config: NgbDropdownConfig, private renderer: Renderer2,
              private cdr: ChangeDetectorRef, private router: Router) {
                config.autoClose = true;
              }
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', [])
    checkScroll() { // Emiting Navbar Details to Navbar Service
      this.navbarService.getNavbarDetails(this.NavBar);
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
      // console.log('Current Mobile Navbar Mode:' + showMobileNavbar);
    });
    this.navbarService.currentNavbarMode.subscribe((navbarMode) => {
      this.navbarMode = navbarMode;
      // console.log('Current NavbarMode: ' + this.navbarMode);
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
    this._location.back();
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
}