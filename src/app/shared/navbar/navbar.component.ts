import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, HostListener } from '@angular/core';
import { NavbarService } from './navbar.service';

import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  showNavbar = true;
  showNavShadow = false;
  showSearchBar = false;

  innerWidth: any;
  mobileThreshold = 567;
  @ViewChild('navbar') NavBar: ElementRef;
  @ViewChild('navbarDropshadow') NavBarDropShadow: ElementRef;

  constructor(private navbarService: NavbarService, config: NgbDropdownConfig, private renderer: Renderer2) {
    config.autoClose = true;
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', [])
    checkScroll() {
      this.navbarService.getNavbarDetails(this.NavBar);
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.navbarService.currentNavbarVisibility.subscribe((showNavbar) => {
      this.showNavbar = showNavbar;
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < this.mobileThreshold) {
        this.removeCollapse();
      }
    });
    this.navbarService.currentNavbarShadowVisibility.subscribe((showNavShadow) => {
      this.showNavShadow = showNavShadow;
    });
  }

  removeCollapse() {
    this.renderer.removeClass(this.NavBar.nativeElement, 'show');
    this.renderer.removeClass(this.NavBarDropShadow.nativeElement, 'show');
  }

  openSearchBar(toggle: boolean) {
    this.showSearchBar = toggle;
  }}
