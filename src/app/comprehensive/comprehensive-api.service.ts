import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { apiConstants } from '../shared/http/api.constants';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { BaseService } from '../shared/http/base.service';
import { HelperService } from '../shared/http/helper.service';
import { Observable } from 'rxjs';
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
        private helperService: HelperService,
    ) { }

    getComprehensiveSummary() {
        const sessionId = { sessionId: this.authService.getSessionId() };

        return this.http
            .post(apiConstants.endpoint.comprehensive.getComprehensiveSummary, sessionId)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    savePersonalDetails(payload) {
        return this.http.post(apiConstants.endpoint.comprehensive.addPersonalDetails, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    addDependents(payload) {
        return this.http.post(apiConstants.endpoint.comprehensive.addDependents, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    saveChildEndowment(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveEndowmentPlan, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveRegularSavings(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveRegularSavings, payload)
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
    saveExpenses(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveSpendings, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveAssets(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveAssets, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveLiabilities(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveLiabilities, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    saveInsurancePlanning(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveInsurancePlan, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveRetirementPlanning(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveRetirementPlan, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    getInsurancePlanning() {
        return this.httpClient.get('../../assets/comprehensive/insurancePlan.json')
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    getPromoCode() {
        return this.http
            .get(apiConstants.endpoint.comprehensive.getPromoCode)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    ValidatePromoCode(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.validatePromoCode, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

    /**
    * Download the comprehensive report.
    *
    * @param {*} payload
    * @returns {Observable<any>}
    * @memberof ApiService
    */
    downloadComprehensiveReport(payload): Observable<any> {
        return this.http.postForBlobParam(apiConstants.endpoint.comprehensive.downloadComprehensiveReport, payload, false)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    saveStepIndicator(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.saveStepIndicator, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    generateComprehensiveReport(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.generateComprehensiveReport, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    createReportRequest(payload) {
        return this.http
            .post(apiConstants.endpoint.comprehensive.createReportRequest, payload)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }
    getReport() {
        return this.http
            .get(apiConstants.endpoint.comprehensive.getReport)
            .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
    }

}
