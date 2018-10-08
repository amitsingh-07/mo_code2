import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  private footerVisibility = new BehaviorSubject(false);

  currentFooterVisibility = this.footerVisibility.asObservable();

  constructor() {}

  setFooterVisibility(isVisible: boolean) {
    console.log(isVisible);
    this.footerVisibility.next(isVisible);
    }
}
