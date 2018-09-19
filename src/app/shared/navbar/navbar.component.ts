import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  constructor(private navbarService: NavbarService, config: NgbDropdownConfig) {
    config.autoClose = true;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.navbarService.currentNavbarVisibility.subscribe((showNavbar) => {
      this.showNavbar = showNavbar;
    });
    this.navbarService.currentNavbarShadowVisibility.subscribe((showNavShadow) => {
      this.showNavShadow = showNavShadow;
      console.log('shadow definition changed to: ' + this.showNavShadow);
    });
  }

  openSearchBar(toggle: boolean) {
    this.showSearchBar = toggle;
  }
}
