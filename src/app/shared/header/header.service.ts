import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private pageTitle = new BehaviorSubject('');
  currentPageTitle = this.pageTitle.asObservable();

  constructor() { }

  setPageTitle(title: string) {
    this.pageTitle.next(title);
  }
}
