import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { GuideMeService } from '../../guide-me/guide-me.service';
import { IEnquiryUpdate, ISetPassword, ISignUp, IVerifyRequestOTP } from '../../sign-up/signup-types';
import { LoaderService } from './../components/loader/loader.service';
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
  private errorMessage = new BehaviorSubject({});
  public newErrorMessage = this.errorMessage.asObservable();
  private handleErrorFlag = '?handleError=true';
  private errorTag = 'An error occurred:';
  private errorTryAgain = 'Something bad happened; please try again later.';

  constructor(
    private configService: ConfigService,
    private http: BaseService,
    public authService: AuthenticationService,
    private modal: NgbModal,
    private guideMeService: GuideMeService,
    private httpClient: HttpClient,
    private router: Router,
    private loaderService: LoaderService) { }

  private handleError(error: HttpErrorResponse) {
    this.loaderService.hideLoader();
    if (error) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error(this.errorTag, error.error.message);
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
      this.errorTryAgain);
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

  getHospitalPlanList(queryParam?: string) {
    let query = '';
    if (queryParam) {
      query = '?' + queryParam;
    }
    return this.http.get(apiConstants.endpoint.getHospitalPlanList + query)
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

  // ---------------------------- PROMOTIONS MODULE --------------------------
  getPromoList() {
    const url = '../../../assets/mock-data/promoList.json';
    return this.http.getMock(url);
  }

  getPromoCategory() {
    const url = '/assets/promotions/promoType.json';
    return this.http.getMock(url);
  }

  getPromoDetail(id: number) {
    const url = '/assets/promotions/' + id + '_details.json';
    return this.http.getMock(url);
  }

  getPromoContent(id: number) {
    const url = '/assets/promotions/' + id + '.jsp';
    return this.http.getArticle(url);
  }

  getPromoTnc(id: number) {
    const url = '/assets/promotions/' + id + '_tnc.jsp';
    return this.http.getArticle(url);
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

  /* Subscribe Newsletter */
  subscribeNewsletter(data) {
    const payload = data;
    return this.http.post(apiConstants.endpoint.subscription.base + this.handleErrorFlag, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.throwSubscribeError(error))
      );
  }

  throwSubscribeError(error: HttpErrorResponse) {
    const templateError = {
      body: 'default',
      detail: 'default',
      status: 500
    };
    this.errorMessage.next(templateError);
    return throwError('');
  }

  /* MyInfo */
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
    return this.http.post(apiConstants.endpoint.signUp + this.handleErrorFlag, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
        })
      );
  }

  updateAccount(payload) {
    return this.http.post(apiConstants.endpoint.updateUserId, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  requestNewOTP(payload: IVerifyRequestOTP) {
    return this.http.post(apiConstants.endpoint.resendOTP, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
        })
      );
  }

  verifyOTP(payload: IVerifyRequestOTP) {
    return this.http.post(apiConstants.endpoint.verifyOTP + this.handleErrorFlag, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
        })
      );
  }

  emailValidityCheck(payload) {
    return this.http.post(apiConstants.endpoint.emailValidityCheck + this.handleErrorFlag, payload);
  }

  setPassword(payload: ISetPassword) {
    return this.http.post(apiConstants.endpoint.setPassword, payload)
      .pipe(
        // tslint:disable-next-line:no-identical-functions
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
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
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
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
    return this.http.post(apiConstants.endpoint.portfolio.setInvestmentObjective, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getQuestionsList() {
    return this.http.get(apiConstants.endpoint.portfolio.getRiskAssessmentQuestions)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getPortfolioAllocationDetails(param) {
    return this.http.get(apiConstants.endpoint.portfolio.getAllocationDetails + param)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  saveRiskAssessment(data) {
    return this.http.post(apiConstants.endpoint.portfolio.updateRiskAssessment, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
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
    return this.http.get(apiConstants.endpoint.investmentAccount.nationalitylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getMoreList() {
    const url = '../assets/mock-data/moreList.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getHoldingList() {
    const url = '../assets/mock-data/holding.json';
    return this.http.getMock(url)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getIndividualPortfolioDetails(portfolioId) {
    return this.http.get(apiConstants.endpoint.investmentAccount.porfolioDetails + '/' + portfolioId)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getInvestmentOverview() {
    return this.http.get(apiConstants.endpoint.investmentAccount.investmentoverview)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getIndustryList() {
    return this.http.get(apiConstants.endpoint.investmentAccount.lndustrylist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getGeneratedFrom() {
    const url = '../assets/mock-data/generatedFrom.json';
    return this.http.get(url)
      .pipe( // tslint:disable-next-line
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
            return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
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
            console.error(this.errorTag, error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
            return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError(this.errorTryAgain);
        })
      );
  }
  getOccupationList() {
    return this.http.get(apiConstants.endpoint.investmentAccount.occupationlist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getAllDropdownList() {
    return this.http.get(apiConstants.endpoint.investmentAccount.allDropdownlist)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  updateInvestment(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.updateInvestment, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  requestForgotPasswordLink(data) {
    return this.http.post(apiConstants.endpoint.forgotPassword, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions
  requestResetPassword(data) {
    return this.http.post(apiConstants.endpoint.resetPassword, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  getDirectSearch(payload) {
    return this.http.post(apiConstants.endpoint.getRecommendations, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      );
  }

  getAddressUsingPostalCode(code) {
    const q = code ? code : '';
    return this.httpClient.jsonp(apiConstants.endpoint.investmentAccount.getAddressByPincode + '&q=' + q, 'callback')
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getUserProfileInfo() {
    return this.http.get(apiConstants.endpoint.userProfileInfo)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  uploadDocument(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.uploadDocument, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  saveInvestmentAccount(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.saveInvestmentAccount, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  saveNationality(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.saveNationality, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  createInvestmentAccount() {
    return this.http.get(apiConstants.endpoint.investmentAccount.createInvestmentAccount + this.handleErrorFlag)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  verifyAML() {
    return this.http.get(apiConstants.endpoint.investmentAccount.verifyAML)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line
  getTopupInvestmentList() {
    // tslint:disable-next-line:no-commented-code
    // return this.http.get(apiConstants.endpoint.article.getArticleCategory)
    const url = '../../../assets/mock-data/topupInvestmentList.json';
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

  getUserBankList() {
    return this.http.get(apiConstants.endpoint.investment.getUserBankList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getUserAddress() {
    return this.http.get(apiConstants.endpoint.investment.getUserAddress)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  saveNewBank(data) {
    return this.http.post(apiConstants.endpoint.investment.addNewBank, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getEditProfileList() {
    return this.http.get(apiConstants.endpoint.editProfile)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  requestEditPassword(data) {
    return this.http.post(apiConstants.endpoint.editPassword, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  requestUpdateEmployerAddress(data) {
    return this.http.post(apiConstants.endpoint.editEmployerAddress, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  requestEditContact(data) {
    return this.http.post(apiConstants.endpoint.editContactDeatails, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getTransferDetails() {
    return this.http.get(apiConstants.endpoint.investmentAccount.getFundTransferDetails)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions ONETIME INVESTMENT API
  buyPortfolio(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.buyPortfolio + this.handleErrorFlag, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions ONETIME INVESTMENT API
  deletePortfolio(data) {
    // need to change the correct endpoint
    return this.http.delete(apiConstants.endpoint.investmentAccount.deletePortfolio + '/' + data.portfolioId + this.handleErrorFlag, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  // tslint:disable-next-line:no-identical-functions MONTHLY INVESTMENT API
  monthlyInvestment(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.monthlyInvestment + this.handleErrorFlag, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  sellPortfolio(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.sellPortfolio + this.handleErrorFlag, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  getAllNotifications() {
    return this.http.get(apiConstants.endpoint.notification.getAllNotifications)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  getRecentNotifications() {
    return this.http.get(apiConstants.endpoint.notification.getRecentNotifications)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  updateNotifications(data) {
    return this.http.post(apiConstants.endpoint.notification.updateNotifications, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // tslint:disable-next-line:no-identical-functions
  deleteNotifications(data) {
    return this.http.post(apiConstants.endpoint.investmentAccount.buyPortfolio, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
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

  downloadWill(payload): Observable<any> {
    return this.http.postForBlob(apiConstants.endpoint.willWriting.downloadWill, payload, false, false)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getTransactionHistory(from?, to?) {
    const queryString = from ? '?fromDate=' + from + '&toDate=' + to : '';
    return this.http.get(apiConstants.endpoint.investment.getTransactions + queryString)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getDetailedCustomerInfo() {
    return this.http.get(apiConstants.endpoint.detailCustomerSummary)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  // Comprehensive Module
  getPersonalDetails() {
    return this.http.get(apiConstants.endpoint.comprehensive.getPersonalDetails)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  downloadStatement(data) {
    return this.http.getBlob(apiConstants.endpoint.investment.getStatement + '?' + data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  addPersonalDetails(payload) {
    return this.http.post(apiConstants.endpoint.comprehensive.addPersonalDetails, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getDependents() {
    return this.http.get(apiConstants.endpoint.comprehensive.getDependents)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  addDependents(payload) {
    return this.http.post(apiConstants.endpoint.comprehensive.addDependents, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  getEarnings() {
    return this.http.get(apiConstants.endpoint.comprehensive.getEarnings)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  saveEarnings(payload) {
    return this.http.post(apiConstants.endpoint.comprehensive.saveEarnings, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  getSpendings() {
    return this.http.get(apiConstants.endpoint.comprehensive.getSpendings)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
  saveSpendings(payload) {
    return this.http.post(apiConstants.endpoint.comprehensive.saveSpendings, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /**
   * Download the comprehensive report.
   *
   * @param {*} payload
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  downloadComprehensiveReport(payload): Observable<any> {
    return this.http.postForBlob(apiConstants.endpoint.comprehensive.downloadComprehensiveReport, payload, false, false)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }
}
