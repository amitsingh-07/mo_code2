import { Injectable } from '@angular/core';
export const SESSION_STORAGE_KEY = 'app_journey_type';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  journeyType: string;
  constructor() { }

  commit(data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  }

  /**
   * clear session storage data.
   */
  clearData() {
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  setJourneyType(type: string) {
    this.journeyType = type;
    this.commit(this.journeyType);
  }

  getJourneyType() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.journeyType = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.journeyType;
  }
}
