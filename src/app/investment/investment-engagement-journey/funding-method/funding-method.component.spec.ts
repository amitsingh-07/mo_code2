import { FundingMethodComponent } from './funding-method.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';

import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { HttpClientModule } from '@angular/common/http';

import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { DatePipe } from '@angular/common';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
//import { mockInvestmentEngagementJourneyService } from './../../../../assets/mocks/service/shared-service';
//import mockData from '../../../../assets/mocks/data/funding-method';
import { concat, Observable, of, throwError } from 'rxjs';
import { Injector } from '@angular/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { SrsTooltipComponent } from '../srs-tooltip/srs-tooltip.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
export class TestComponent {
}
describe('FundingMethodComponent', () => {
  let component: FundingMethodComponent;
  let fixture: ComponentFixture<FundingMethodComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let investmentAccountService: InvestmentAccountService;
  let investmentCommonService: InvestmentCommonService;
 // let investAccountService: mockInvestmentEngagementJourneyService;
  let loader: LoaderService;
  let injector: Injector;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');


  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [FundingMethodComponent, SrsTooltipComponent],
        imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
          ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
        providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
          InvestmentAccountService,
          LoaderService,
          { provide: InvestmentAccountService }],
      })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SrsTooltipComponent] } })
      .compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingMethodComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
    ngbModalService = TestBed.get(NgbModal);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });


  it('should create', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('FUNDING_METHOD.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('FUNDING_METHOD.TITLE');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    // spyOn(investmentAccountService, 'getInvestmentAccountFormData').and.returnValue({selectedPortfolioType: 'Investment'});
    // spyOn(investmentCommonService, 'getInvestmentCommonFormData').and.returnValue({formValues: {initialFundingMethodId :'Cash'}});
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    // expect(component.fundingMethodForm.valid).toBeFalsy();
    // component.fundingMethodForm.controls['initialFundingMethodId'].setValue('Cash');
    // expect(component.fundingMethodForm.valid).toBeTruthy();
  });

  it('should navigate to Funding method Step1 if investment portfolio,', () => {
    spyOn(router, 'navigate');
    //expect(component.fundingMethodForm.valid).toBeFalsy();
    component.fundingMethodForm.controls['initialFundingMethodId'].setValue("Cash");
   // expect(component.fundingMethodForm.valid).toBeTruthy();
    component.goToNext(component.fundingMethodForm);
   expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  });
 

  it('should call show error modal', () => {
    ngbModalRef = ngbModalService.open(SrsTooltipComponent);
    spyOn(ngbModalService, 'open').and.returnValue(ngbModalRef);
    const showModal = component.showHelpModal();
    expect(ngbModalService.open).toHaveBeenCalled();
    expect(ngbModalRef.componentInstance.errorTitle).toEqual('Supplementary Retirement Scheme (SRS)');
    expect(ngbModalRef.componentInstance.errorMessage).toEqual('The SRS is a voluntary savings scheme by the government to encourage people to save for their retirement. You can contribute annually to your SRS account up to a cap. These contributions are eligible for tax relief.');
    expect(showModal).toEqual();
  });
  
  afterEach(() => {
    TestBed.resetTestingModule();
    const fundingMethods: any = {
      responseMessage: {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      },
      objectList:
      {
        "portfolioFundingMethod": [
          {
            "id": 377,
            "name": "SRS",
            "value": "SRS",
            "key": "SRS"
          },
          {
            "id": 378,
            "name": "Cash",
            "value": "Cash",
            "key": "Cash"
          }
        ]
      }

    };
    console.log(fundingMethods);
  });
  
  it('should create GetStarted Screen title', () => {
    expect(component.loaderTitle).toBe('FUNDING_METHOD.LOADER_TITLE');
    expect(component.loaderDesc).toBe('FUNDING_METHOD.LOADER_DESC');
    });
});