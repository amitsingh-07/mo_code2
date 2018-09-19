import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private navbarVisibility = new BehaviorSubject(true);
  private navbarShadowVisibility = new BehaviorSubject(true);

  isNavbarCollapsed = true;
  currentNavbarShadowVisibility = this.navbarShadowVisibility.asObservable();
  currentNavbarVisibility = this.navbarVisibility.asObservable();

  constructor() {}

  setNavbarVisibility(isVisible: boolean) {
    this.navbarVisibility.next(isVisible);
    }

  setNavbarShadowVisibility(isVisible: boolean) {
    this.navbarShadowVisibility.next(isVisible);
  }

}
