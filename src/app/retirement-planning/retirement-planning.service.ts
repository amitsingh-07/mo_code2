import { Injectable } from '@angular/core';

import { IUserDetails, IRetirementNeeds } from './retirement-planning-types';
import { RetirementPlanningData } from './retirement-planning-form-data';

const SESSION_STORAGE_KEY = 'app_retirement_planning_session';

@Injectable({
    providedIn: 'root'
})

export class RetirementPlanningService {
    private retirementPlanningForm: RetirementPlanningData = new RetirementPlanningData();

    constructor() {
        // get data from session storage
        this.getRetirementPlanningFormData();
    }

    /**
    * set retirement planning form data from session storage when reload happens.
    */
    getRetirementPlanningFormData(): RetirementPlanningData {
        if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
            this.retirementPlanningForm = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
        }
        return this.retirementPlanningForm;
    }

    /**
     * save data in session storage.
     */
    commit() {
        if (window.sessionStorage) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.retirementPlanningForm));
        }
    }

    /**
    * set retirement planning details.
    * @param data - user retirement planning details.
    */
    setUserDetails(data: IUserDetails) {
        this.retirementPlanningForm.userDetails = data;
        this.commit();
    }

    /**
   * get retirement planning details.
   * @param data - user retirement planning details.
   */
    getUserDetails() {
        if (!this.retirementPlanningForm.userDetails) {
            this.retirementPlanningForm.userDetails = {} as IUserDetails;
        }
        return this.retirementPlanningForm.userDetails;
    }
}