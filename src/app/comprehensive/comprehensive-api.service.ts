import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { apiConstants } from '../shared/http/api.constants';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { BaseService } from '../shared/http/base.service';
import { HelperService } from '../shared/http/helper.service';
@Injectable({
    providedIn: 'root'
})
export class ComprehensiveApiService {
    private handleErrorFlag = '?handleError=true';
    constructor(
        private apiService: ApiService,
        private authService: AuthenticationService,
        private http: BaseService,
        private httpClient: HttpClient,
        private helperService: HelperService
    ) { }

    getComprehensiveSummary() {
        const sessionId = this.authService.getSessionId();

        return this.http
            .get(`${apiConstants.endpoint.comprehensive.getComprehensiveSummary}?sessionId=${sessionId}`)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    getPersonalDetails() {
        return this.apiService.getPersonalDetails();
    }

    savePersonalDetails(payload) {
        return this.apiService.addPersonalDetails(payload);
    }

    getDependents() {
        return this.apiService.getDependents();
    }

    addDependents(payload) {
        return this.apiService.addDependents(payload);
    }
    getChildEndowment() {
        return this.http
            .get(apiConstants.endpoint.comprehensive.getEndowmentPlan)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveChildEndowment(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveEndowmentPlan, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveDownOnLuck(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveDownOnLuck, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    saveEarnings(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveEarnings, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveInsurancePlanning(payload) {
        return this.http
        .post(apiConstants.endpoint.comprehensive.saveInsurancePlan, payload)
        .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveRetirementPlanning(payload){
        return this.http
        .post(apiConstants.endpoint.comprehensive.saveRetirementPlan, payload)
        .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    getInsurancePlanning() {
        return this.httpClient.get('../../assets/comprehensive/insurancePlan.json');
    }
}
