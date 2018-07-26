import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private pageTitle = new BehaviorSubject('');
  private pageSubTitle = new BehaviorSubject('');

  currentPageTitle = this.pageTitle.asObservable();
  currentPageSubTitle = this.pageSubTitle.asObservable();

  constructor() { }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.pageTitle.next(title);
    if (subTitle) {
      this.pageSubTitle.next(subTitle);
    } else {
      this.pageSubTitle.next('');
    }
  }
}
