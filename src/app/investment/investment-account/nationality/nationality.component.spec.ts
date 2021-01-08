import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { MockInvestmentAccountService } from './../../../../assets/mocks/service/shared-service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';

import { getTestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { DatePipe } from '@angular/common';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { concat, Observable, of, throwError } from 'rxjs';
import { Injector } from '@angular/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';


import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';


import { NationalityComponent } from './nationality.component';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';

describe('NationalityComponent', () => {
  let component: NationalityComponent;
  let fixture: ComponentFixture<NationalityComponent>;
  let investAccountService: MockInvestmentAccountService;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let investmentAccountService: InvestmentAccountService;
  let investmentCommonService: InvestmentCommonService;
  //let investAccountService: mockInvestmentEngagementJourneyService;
  let loader: LoaderService;
  let injector: Injector;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;
  let translations = require('../../../../assets/i18n/investment-account/en.json');


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NationalityComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
        InvestmentAccountService,
        LoaderService,
        {
          provide: InvestmentAccountService
          //useClass: mockInvestmentEngagementJourneyService 
        }],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityComponent);
    component = fixture.componentInstance;
    investAccountService = TestBed.get(InvestmentAccountService);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    router = TestBed.get(Router);
    ngbModalService = TestBed.get(NgbModal);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    // spyOn(investmentEngagementJourneyService, 'getPortfolioFormData').and.returnValue({});
    // spyOn(investAccountService, 'getInvestmentAccountFormData').and.returnValue({});
    const loadDDCRoadmapSpy = spyOn(investAccountService, 'loadDDCRoadmap');
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();

    let errors = {};
    let nationality = component.selectNationalityForm.controls['nationality'];
    expect(nationality.valid).toBeFalsy();
    errors = nationality.errors || {};
    expect(errors['required']).toBeTruthy();
    nationality.setValue('SG');
  });
  it('should call show error modal', () => {

    ngbModalRef = ngbModalService.open(ErrorModalComponent);
    spyOn(ngbModalService, 'open').and.returnValue(ngbModalRef);
    const openModal = component.openModal();
    let TITLE = "We do not accept applications if you reside or have tax residencies in the following countries.";
    let DESC = "Afghanistan, Albania, Algeria, Angola, Anguilla, Antigua and Barbuda, Argentina, Armenia, Azerbaijan, Bahamas, Bangladesh, Belarus, Belize, Benin, Bolivia, Bosnia-Herzegovina, Botswana, Brazil, Burkina Faso, Burundi, Cameroon, Cambodia, Cape Verde, Central African Republic, Chad, Columbia, Comoros, Congo (Brazzaville), Congo (The Democratic Republic), Cook Islands, Costa Rica, Cote D’Ivoire, Cuba, Curacao, Cyprus, Djibouti, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Ethiopia, Gabon, Gambia, Ghana, Guatemala, Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Iceland, India, Iran (Islamic Republic of), Iraq, Jamaica, Kazakhstan, Kenya, Kosovo, Kyrgyzstan, Lao People’s Democratic Republic, Laos, Latvia, Lebanon, Liberia, Lesotho, Libya, Liechtenstein, Macau, Madagascar, Malawi, Maldives, Mali, Marshall Islands, Mauritania, Mexico, Moldova, Mongolia, Monaco, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Nicaragua, Niger, Nigeria, Niue, North Korea, Pakistan, Palau, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Russian Federation, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Somalia, South Sudan, Sri Lanka, St Kitts & Nevis, Sudan, Swaziland, Syria, Tajikistan, Tanzania, The Southern Philippines, The Sulu/Sulawesi, Seas Littoral, The Trans-Sahara, Timor-Leste, Togo, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Uganda, Ukraine, United Arab Emirates, Uzbekistan, Vanuatu, Venezuela, Vietnam, West Bank (Palestinian Territory, Occupied), Yemen, Zambia, Zimbabwe.";
    let GOT_IT: "Got It";
    expect(ngbModalService.open).toHaveBeenCalled();
    expect(TITLE).toEqual(TITLE);
    expect(DESC).toEqual(DESC);
    expect(GOT_IT).toEqual(GOT_IT)
  });

  it('should call show error modal', () => {
    ngbModalRef = ngbModalService.open(ModelWithButtonComponent);
    spyOn(ngbModalService, 'open').and.returnValue(ngbModalRef);
    let modalTitle = "Oops, Unable To Proceed";
    let modalMessage = "Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.";
    let ButtonTitle = "Back To Dashboard";
    const openModal = component.showErrorMessage(modalTitle, modalMessage);
    expect(ngbModalService.open).toHaveBeenCalled();
    expect(ngbModalRef.componentInstance.errorTitle).toEqual(modalTitle);
    expect(ngbModalRef.componentInstance.errorMessage).toEqual(modalMessage);
    spyOn(router, 'navigate');
    expect(router.navigate).toHaveBeenCalledWith[SIGN_UP_ROUTE_PATHS.DASHBOARD];
  });
  // 

  it('should call show error modal', () => {
    ngbModalRef = ngbModalService.open(ModelWithButtonComponent);
    spyOn(ngbModalService, 'open').and.returnValue(ngbModalRef);
    let modalTitle = "Oops, Unable To Proceed";
    let modalMessage = "Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.";
    let ButtonTitle = "Back To Dashboard";
    const openModal = component.showBlockedCountryErrorMessage(modalTitle, modalMessage);
    expect(ngbModalService.open).toHaveBeenCalled();
    expect(ngbModalRef.componentInstance.errorTitle).toEqual(modalTitle);
    expect(ngbModalRef.componentInstance.errorMessage).toEqual(modalMessage);
    spyOn(router, 'navigate');
    expect(router.navigate).toHaveBeenCalledWith[SIGN_UP_ROUTE_PATHS.DASHBOARD];
  });
  // () {
    it('should buildAdditionalControls', () => {
      spyOn(component, 'buildAdditionalControls').and.returnValue({});
      component.buildAdditionalControls();
      // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
    });
});