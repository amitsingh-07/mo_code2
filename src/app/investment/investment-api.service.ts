import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { investmentApiConstants } from '../investment/investment.api.constants';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { BaseService } from '../shared/http/base.service';
import { IServerResponse } from '../shared/http/interfaces/server-response.interface';
import { DirectFormData } from './../direct/direct-form-data';

const newLocal = 'EnquiryId';
@Injectable({
  providedIn: 'root'
})
export class InvestmentApiService {
  private errorMessage = new BehaviorSubject({});
  public newErrorMessage = this.errorMessage.asObservable();

  constructor(
    private http: BaseService,
    public authService: AuthenticationService,
    private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`);
        return throwError('API returned error response');
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  savePersonalInfo(data) {
    return this.http.post(investmentApiConstants.endpoint.portfolio.setInvestmentObjective, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getQuestionsList() {
    return this.http.get(investmentApiConstants.endpoint.portfolio.getRiskAssessmentQuestions)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getPortfolioAllocationDetails(param) {
    const url = investmentApiConstants.endpoint.portfolio.getAllocationDetails.replace('$ENQUIRY_ID$', param.enquiryId);
    return this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getPortfolioDetailsWithAuth() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.getPortfolioDetailsWithAuth)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  saveRiskAssessment(data) {
    return this.http.post(investmentApiConstants.endpoint.portfolio.updateRiskAssessment, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getNationalityCountryList() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.nationalityCountrylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getNationalityList() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.nationalitylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getCustomerPortfolioDetailsById(customerPortfolioId) {
    const url = investmentApiConstants.endpoint.investmentAccount.porfolioDetails.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getInvestmentOverview() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.investmentoverview)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getIndustryList() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.lndustrylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getOccupationList() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.occupationlist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getAllDropdownList() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.allDropdownlist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getInvestmentsSummary() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.investmentsSummary)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  updateInvestment(customerPortfolioId, data) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(investmentApiConstants.endpoint.investmentAccount.updateInvestment.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId), data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getAddressUsingPostalCode(code) {
    const q = code ? code : '';
    return this.httpClient.jsonp(investmentApiConstants.endpoint.investmentAccount.getAddressByPincode + '&q=' + q, 'callback')
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  uploadDocument(data) {
    return this.http.post(investmentApiConstants.endpoint.investmentAccount.uploadDocument, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  saveInvestmentAccount(data) {
    return this.http.post(investmentApiConstants.endpoint.investmentAccount.saveInvestmentAccount, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  saveNationality(data) {
    return this.http.post(investmentApiConstants.endpoint.investmentAccount.saveNationality, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  createInvestmentAccount(params) {
    return this.http.post(investmentApiConstants.endpoint.investmentAccount.createInvestmentAccount, params)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  verifyAML() {
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.verifyAML)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getUserBankList() {
    return this.http.get(investmentApiConstants.endpoint.investment.getUserBankList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getUserAddress() {
    return this.http.get(investmentApiConstants.endpoint.investment.getUserAddress)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getTransferDetails(customerPortfolioId) {
    const url =
      investmentApiConstants.endpoint.investmentAccount.getFundTransferDetails.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions ONETIME INVESTMENT API
  buyPortfolio(customerPortfolioId, data) {
    const url = investmentApiConstants.endpoint.investmentAccount.buyPortfolio.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.post(url, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions ONETIME INVESTMENT API
  deletePortfolio(data) {
    // need to change the correct endpoint
    return this.http.delete(
      investmentApiConstants.endpoint.investmentAccount.deletePortfolio + '/' + data.customerPortfolioId + '?handleError=true', data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions MONTHLY INVESTMENT API
  monthlyInvestment(customerPortfolioId, data) {
    const url = investmentApiConstants.endpoint.investmentAccount.monthlyInvestment.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.post(url, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  sellPortfolio(customerPortfolioId, data) {
    const url = investmentApiConstants.endpoint.investmentAccount.sellPortfolio.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.post(url, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getTransactionHistory(id) {
    return this.http.get(investmentApiConstants.endpoint.investment.getTransactions + id + '/transactions/search')
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  downloadStatement(data) {
    return this.http.getBlob(investmentApiConstants.endpoint.investment.getTransactions + '' + data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }  // Get User's monthly investment Information
  getMonthlyInvestmentInfo(customerPortfolioId) {
    const url = investmentApiConstants.endpoint.investment.monthlyInvestmentInfo.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getOneTimeInvestmentInfo(customerPortfolioId) {
    const url = investmentApiConstants.endpoint.portfolio.setOneTimeInvestmentObjective.replace('$CUSTOMER_PORTFOLIO_ID$', customerPortfolioId);
    return this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
 // #GET FINANCIAL DETAILS
  // tslint:disable-next-line:no-identical-functions
  getUserFinancialDetails() {
    return this.http.get(investmentApiConstants.endpoint.portfolio.getFinancialDetails)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getInvestmentPeriod() {
    const url = '../assets/mock-data/investmentPeriod.json';

    return this.http.get(url)
      .pipe( // tslint:disable-next-line
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
            return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getHoldingList() {
    const url = '../assets/mock-data/holding.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getPortfolioList() {
    // tslint:disable-next-line:no-commented-code
    // return this.http.get(apiConstants.endpoint.article.getArticleCategory)
    const url = '../../../assets/mock-data/portfolioList.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  savePortfolioName(param) {
  //  #const url = '../../../assets/mock-data/add-portfolio-name.json';
  //  return this.http.getMock(url);
  return this.http.post(investmentApiConstants.endpoint.investmentAccount.savePortfolioName, param)
   .pipe(
     catchError((error: HttpErrorResponse) => this.handleError(error))
   );
  }

   // tslint:disable-next-line:no-identical-functions
   confirmPortfolio(customerPortfolioId) {
    // #const url = '../../../assets/mock-data/confirm-portfolio.json';
    // return this.http.getMock(url);
   // tslint:disable-next-line:max-line-length
    return this.http.get(investmentApiConstants.endpoint.investmentAccount.confirmPortfolio.replace('$customerPortfolioId$', customerPortfolioId))
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

  getFirstInvAccountCreationStatus() {
    return this.http.get(investmentApiConstants.endpoint.investment.getFirstInvAccountCreationStatus)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
}
