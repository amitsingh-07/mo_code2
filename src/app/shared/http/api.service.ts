
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserInfo } from './../../guide-me/get-started/get-started-form/user-info';

import { ConfigService } from '../../config/config.service';
import { GuideMeService } from '../../guide-me/guide-me.service';
import { IEnquiryUpdate, ISetPassword, ISignUp, IVerifyRequestOTP } from '../../sign-up/signup-types';
import { IRecommendationRequest } from './../interfaces/recommendations.request';
import { apiConstants } from './api.constants';
import { AuthenticationService } from './auth/authentication.service';
import { BaseService } from './base.service';
import { IServerResponse } from './interfaces/server-response.interface';

const SIGN_UP_MOCK_DATA = '../assets/mock-data/questions.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private configService: ConfigService,
    private http: BaseService,
    public authService: AuthenticationService,
    private modal: NgbModal,
    private guideMeService: GuideMeService,
    private httpClient: HttpClient,
    private router: Router) { }

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
          `body was: ${error.error}`);
        return throwError('API returned error response');
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getProfileList() {
    return this.http.get(apiConstants.endpoint.getProfileList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getLongTermCareList() {
    return this.http.get(apiConstants.endpoint.getLongTermCareList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getHospitalPlanList() {
    return this.http.get(apiConstants.endpoint.getHospitalPlanList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // -------------------------- ARTICLES MODULE ---------------------------------------
  getGetStartedArticles() {
    const url = '../../../assets/mock-data/getStartedArticles.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getRecentArticles(quantity?: number) {
    const payload = { number: 0 };
    if (quantity) {
      payload.number = quantity;
    }
    return this.http.post(apiConstants.endpoint.article.getRecentArticles, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getArticleData(art_id) {
    const payload = { article_id: art_id };
    return this.http.post(apiConstants.endpoint.article.getArticle + '/' + art_id, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getArticleContent(art_id) {
    const url = '/assets/articles/' + art_id + '.jsp';
    return this.http.getArticle(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.router.navigate(['/articles']))
      );
  }

  getRelatedArticle(in_tag_id: number) {
    const payload = { tag_id: in_tag_id };
    return this.http.post(apiConstants.endpoint.article.getRelatedArticle + '/' + in_tag_id, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getArticleCategory() {
    const payload = null;
    return this.http.post(apiConstants.endpoint.article.getArticleCategory, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getArticleCategoryList(category_id) {
    const urlAddOn = category_id;
    const payload = null;
    if (urlAddOn === -1) {
      return this.http.post(apiConstants.endpoint.article.getArticleCategoryAllList, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    } else {
      return this.http.post(apiConstants.endpoint.article.getArticleCategoryList + '/' + urlAddOn, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }
  }

  // ---------------------------- ABOUT US MODULE ----------------------------
  getCustomerReviewList() {
    // tslint:disable-next-line:no-commented-code
    const payload = {};
    return this.http.post(apiConstants.endpoint.aboutus.getCustomerReviews, payload, true)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getSubjectList() {
    const url = '../../../assets/about-us/subjectList.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }
  sendContactUs(data) {
    const payload = {
      toEmail: data.email,
      subject: data.subject,
      body: data.message
    };
    return this.http.post(apiConstants.endpoint.aboutus.sendContactUs, payload, true)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

  subscribeNewsletter(data) {
    const payload = data;
    return this.http.post(apiConstants.endpoint.subscription.base, payload)
    .pipe (
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  subscribeHandleError(error: HttpErrorResponse) {
    console.log(error);
  }
  getMyInfoData(data) {
    return this.http.post(apiConstants.endpoint.getMyInfoValues, data, true)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getProtectionNeedsList(userInfoForm) {
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, userInfoForm)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getRecommendations(payload: IRecommendationRequest) {
    return this.http.post(apiConstants.endpoint.getRecommendations, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /* SignUp API */
  requestVerifyMobile(): string {
    return '000000';
  }

  getCountryCodeList() {
    const url = 'assets/country-data/phone.json';
    return this.httpClient.get(url);
  }

  createAccount(payload: ISignUp) {
    return this.http.post(apiConstants.endpoint.signUp + '?handleError=true', payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  requestNewOTP(payload: IVerifyRequestOTP) {
    return this.http.post(apiConstants.endpoint.resendOTP, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  verifyOTP(payload: IVerifyRequestOTP) {
    return this.http.post(apiConstants.endpoint.verifyOTP, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  setPassword(payload: ISetPassword) {
    return this.http.post(apiConstants.endpoint.setPassword, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  verifyEmail(payload) {
    return this.http.post(apiConstants.endpoint.verifyEmail, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  /** Post Login */
  updateInsuranceEnquiry(payload: IEnquiryUpdate) {
    return this.http.post(apiConstants.endpoint.updateProductEnquiry, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // -------------------------- PORTFOLIO MODULE ---------------------------------------

  savePersonalInfo(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/setPersonalInfo.json';
    return this.http.post(apiConstants.endpoint.portfolio.setInvestmentObjective, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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

  getQuestionsList() {
    const url = '../assets/mock-data/questions.json';
    // tslint:disable-next-line
    // const url = "http://10.144.196.214:8080/investment-microservice/RiskAssessment";
    return this.http.get(apiConstants.endpoint.portfolio.getRiskAssessmentQuestions)
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

  getPortfolioAllocationDetails(param) {
    const url = '../assets/mock-data/portfolioAllocationDetails.json';
    // tslint:disable-next-line
    // const url = "http://10.144.196.214:8080/investment-microservice/RiskAssessment";
    return this.http.get(apiConstants.endpoint.portfolio.getAllocationDetails + param)
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

  saveRiskAssessment(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/setRiskAssessment.json';

    return this.http.post(apiConstants.endpoint.portfolio.updateRiskAssessment, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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

  getProductCategory() {
    const payload = {
      profileId: '',
      birthDate: '00/00/0000',
      journeyType: 'direct',
      noOfDependents: 0
    };
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getNationalityCountryList() {
    return this.http.get(apiConstants.endpoint.investmentAccount.nationalityCountrylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getNationalityList() {
    const url = '../assets/mock-data/nationalityList.json';
    return this.http.get(apiConstants.endpoint.investmentAccount.nationalitylist)
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

  getIndustryList() {
    const url = '../assets/mock-data/industryList.json';
    return this.http.get(apiConstants.endpoint.investmentAccount.lndustrylist)
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
  getGeneratedFrom() {
    const url = '../assets/mock-data/generatedFrom.json';
    // return this.http.get(apiConstants.endpoint.investmentAccount.lndustrylist)
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
  getOccupationList() {
    const url = '../assets/mock-data/occupationList.json';
    return this.http.get(apiConstants.endpoint.investmentAccount.occupationlist)
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

  getAllDropdownList() {
    const url = '../assets/mock-data/reason.json';
    return this.http.get(apiConstants.endpoint.investmentAccount.allDropdownlist)
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

  updateInvestment(data) {
    const url = '../assets/mock-data/reason.json';
    return this.http.post(apiConstants.endpoint.investmentAccount.updateInvestment, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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

  // tslint:disable-next-line:no-identical-functions
  requestForgotPasswordLink(data) {
    // tslint:disable-next-line
    //const url = 'https://bfa-dev.ntucbfa.cloud/account/account-microservice/api/forgotPassword';
    // tslint:disable-next-line:no-commented-code
    const url = '../assets/mock-data/forgotPassword.json';

    return this.http.post(apiConstants.endpoint.forgotPassword + '?handleError=true', data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
            // return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }
  // tslint:disable-next-line:no-identical-functions
  requestResetPassword(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/forgotPassword.json';

    return this.http.post(apiConstants.endpoint.resetPassword, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
            // return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  // tslint:disable-next-line:no-identical-functions
  getDirectSearch(payload) {
    // const url = '../assets/mock-data/directResults.json';
    // return this.httpClient.get<IServerResponse>(url);
    return this.http.post(apiConstants.endpoint.getRecommendations, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      );
  }

  getAddressUsingPostalCode(code) {
    // tslint:disable-next-line
    // const url = "http://10.144.196.214:8080/investment-microservice/RiskAssessment";
    const q = code ? code : '';
    return this.httpClient.jsonp(apiConstants.endpoint.investmentAccount.getAddressByPincode + '&q=' + q, 'callback')
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
            // return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getUserProfileInfo() {
    const url = '';
    return this.http.get(apiConstants.endpoint.userProfileInfo)
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

  // tslint:disable-next-line:no-identical-functions
  uploadDocument(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/setRiskAssessment.json';

    return this.http.post(apiConstants.endpoint.portfolio.updateRiskAssessment, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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
  // tslint:disable-next-line:no-identical-functions
  uploadDocumentBO(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/setRiskAssessment.json';
    console.log('Data Posted: ');
    console.log(data);
    return this.http.post(apiConstants.endpoint.portfolio.updateRiskAssessment, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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

  createInvestmentAccount(data) {
    // tslint:disable-next-line
    // const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/createInvestmentAccount.json';

    return this.http.post(apiConstants.endpoint.investmentAccount.createInvestmentAccount, data)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
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

   // Verify PromoCode
   verifyPromoCode(promoCode) {
     return this.http.post(apiConstants.endpoint.willWriting.verifyPromoCode, promoCode)
     .pipe(
       catchError((error: HttpErrorResponse) => this.handleError(error))
     );
   }

   createWill(payload) {
    return this.http.post(apiConstants.endpoint.willWriting.createWill, payload)
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateWill(payload) {
    return this.http.post(apiConstants.endpoint.willWriting.updateWill, payload)
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getWill(payload) {
    return this.http.post(apiConstants.endpoint.willWriting.getWill, payload)
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  downloadWill(payload): Observable<any>  {
    return this.http.postForBlob(apiConstants.endpoint.willWriting.downloadWill, payload, false , false)
     .pipe(
       catchError((error: HttpErrorResponse) => this.handleError(error))
     );
  }

}
