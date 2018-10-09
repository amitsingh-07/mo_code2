import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { WillWritingFormData } from './will-writing-form-data';

const SESSION_STORAGE_KEY = 'app_will_writing_session';

@Injectable({
  providedIn: 'root'
})
export class WillWritingService {
  private willWritingFormData: WillWritingFormData = new WillWritingFormData();
  constructor(private http: HttpClient) {
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.willWritingFormData));
    }
  }

  clearData() {
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
  }
}
