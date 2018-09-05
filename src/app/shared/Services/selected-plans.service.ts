import { Injectable } from '@angular/core';
const SESSION_STORAGE_KEY = 'selectedPlan_session_storage_key';

@Injectable({
  providedIn: 'root'
})
export class SelectedPlansService {
  selectedPlanData: any[];
  constructor() { }
  commit(data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  }
  setSelectedPlan(data) {
    this.selectedPlanData = data;
    this.commit(data);
  }
  getSelectedPlan() {
    return this.selectedPlanData;
  }
}
