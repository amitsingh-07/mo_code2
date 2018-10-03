import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private navbar = new Subject();
  private navbarVisibility = new BehaviorSubject(true);
  private navbarShadowVisibility = new BehaviorSubject(true);

  existingNavbar = this.navbar.asObservable();
  isNavbarCollapsed = true;
  currentNavbarShadowVisibility = this.navbarShadowVisibility.asObservable();
  currentNavbarVisibility = this.navbarVisibility.asObservable();

  constructor() {}

  getNavbarDetails(navbar: ElementRef) {
    this.navbar.next(navbar);
  }

  setNavbarVisibility(isVisible: boolean) {
    this.navbarVisibility.next(isVisible);
    }

  setNavbarShadowVisibility(isVisible: boolean) {
    this.navbarShadowVisibility.next(isVisible);
    }

}