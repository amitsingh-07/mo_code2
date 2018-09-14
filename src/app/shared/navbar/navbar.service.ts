import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private navbarVisibility = new BehaviorSubject(true);

  currentNavbarVisibility = this.navbarVisibility.asObservable();

  constructor() {}

  setNavbarVisibility(isVisible: boolean) {
    this.navbarVisibility.next(isVisible);
    console.log('Service recieved');
    }

}
