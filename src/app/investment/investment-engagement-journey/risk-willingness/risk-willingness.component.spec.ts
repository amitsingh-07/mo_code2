

import { RiskWillingnessComponent } from './risk-willingness.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed,getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { TranslateService } from '@ngx-translate/core';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../../shared/logger/logger.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { QuestionIcons } from './questionicon';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from 'src/app/sign-up/sign-up.service';
import { DatePipe } from '@angular/common';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';



describe('RiskWillingnessComponent', () => {
  let component: RiskWillingnessComponent;
  let fixture: ComponentFixture<RiskWillingnessComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let translateService: TranslateService
  let injector: Injector;
  let investmentAccountService:InvestmentAccountService;
  let  authService: AuthenticationService;
  let signUpService: SignUpService;
  let investmentEngagementJourneyService:InvestmentEngagementJourneyService;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
   declarations: [RiskWillingnessComponent],
    imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
      ReactiveFormsModule, JwtModule.forRoot({ config: {} }),
      HttpClientModule],
    providers: [NgbActiveModal,DatePipe],
   })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWillingnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    translateService = TestBed.get(TranslateService);
    translateService = injector.get(TranslateService);
    investmentAccountService = injector.get(InvestmentAccountService);
    authService = injector.get(AuthenticationService);
    signUpService  = injector.get(SignUpService);
    investmentEngagementJourneyService = injector.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
 });


 it('should create risk willing  title', () => {
  expect(component.pageTitle).toBe('RISK_ASSESSMENT.TITLE');
  expect(component.QuestionLabel).toBe('RISK_ASSESSMENT.QUESTION_LBL');
  expect(component.ofLabel).toBe('RISK_ASSESSMENT.OF_LBL');
});

it('should set page title', () => {
  const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
  component.setPageTitle('RISK_ASSESSMENT.STEP_2_LABEL');
  expect(setPageTitleSpy).toHaveBeenCalledWith('RISK_ASSESSMENT.STEP_2_LABEL');
});
afterEach(() => {
  TestBed.resetTestingModule();
  const questionsList: any = {
    "exception": null,
    "objectList": [
      {
        "id": 1,
        "description": "Investing carries risk. I am willing to accept temporary losses in the short term to achieve investment gains in the longer term.",
        "text": null,
        "options": [
          {
            "id": 1,
            "text": "Yes",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 1,
            "additionalInfo": {
              "displayInfo": "Yes"
            },
            "listingOrder": 1
          },
          {
            "id": 2,
            "text": "No",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 2,
            "additionalInfo": {
              "displayInfo": "No"
            },
            "listingOrder": 2
          }
        ],
        "listOrder": 1
      },
      {
        "id": 2,
        "description": "If your intended investment has an unrealised/paper loss of more than 30%, what would you do?",
        "text": null,
        "options": [
          {
            "id": 3,
            "text": "Sell all my investments",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 3,
            "additionalInfo": {
              "displayInfo": "Sell all"
            },
            "listingOrder": 1
          },
          {
            "id": 4,
            "text": "Sell some of my investments",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 4,
            "additionalInfo": {
              "displayInfo": "Sell some"
            },
            "listingOrder": 2
          },
          {
            "id": 5,
            "text": "Do nothing",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 5,
            "additionalInfo": {
              "displayInfo": "Do nothing"
            },
            "listingOrder": 3
          },
          {
            "id": 6,
            "text": "Top up my investments",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 6,
            "additionalInfo": {
              "displayInfo": "Top up"
            },
            "listingOrder": 4
          }
        ],
        "listOrder": 2
      },
      {
        "id": 3,
        "description": "If your intended investment fluctuates significantly, your stress level will be:",
        "text": null,
        "options": [
          {
            "id": 7,
            "text": "High",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 7,
            "additionalInfo": {
              "displayInfo": "High"
            },
            "listingOrder": 1
          },
          {
            "id": 8,
            "text": "Moderate",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 8,
            "additionalInfo": {
              "displayInfo": "Moderate"
            },
            "listingOrder": 2
          },
          {
            "id": 9,
            "text": "Low",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 9,
            "additionalInfo": {
              "displayInfo": "Low"
            },
            "listingOrder": 3
          },
          {
            "id": 10,
            "text": "No stress at all",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 10,
            "additionalInfo": {
              "displayInfo": "No stress"
            },
            "listingOrder": 4
          }
        ],
        "listOrder": 3
      },
      {
        "id": 4,
        "description": "Which of the following portfolio would you choose to invest in?",
        "text": null,
        "options": [
          {
            "id": 11,
            "text": "A",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 11,
            "additionalInfo": {
              "optimisticProjection": "4%",
              "pessimisticProjection": "-2%",
              "displayInfo": "A"
            },
            "listingOrder": 1
          },
          {
            "id": 12,
            "text": "B",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 12,
            "additionalInfo": {
              "optimisticProjection": "8%",
              "pessimisticProjection": "-5%",
              "displayInfo": "B"
            },
            "listingOrder": 2
          },
          {
            "id": 13,
            "text": "C",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 13,
            "additionalInfo": {
              "optimisticProjection": "12%",
              "pessimisticProjection": "-8%",
              "displayInfo": "C"
            },
            "listingOrder": 3
          },
          {
            "id": 14,
            "text": "D",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 14,
            "additionalInfo": {
              "optimisticProjection": "15%",
              "pessimisticProjection": "-13%",
              "displayInfo": "D"
            },
            "listingOrder": 4
          },
          {
            "id": 15,
            "text": "E",
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 15,
            "additionalInfo": {
              "optimisticProjection": "19%",
              "pessimisticProjection": "-17%",
              "displayInfo": "E"
            },
            "listingOrder": 4
          }
        ],
        "listOrder": 4
      }
    ],
    "responseMessage": {
      "responseCode": 6000,
      "responseDescription": "Successful response"
    }
  };
  console.log(questionsList);
});


it(`should fetch posts as an Observable`,
  () => {
   const questionsList: any = {
     "objectList": [
        {
          "id": 1,
          "description": "Investing carries risk. I am willing to accept temporary losses in the short term to achieve investment gains in the longer term.",
          "text": null,
          "options": [
            {
              "id": 1,
              "text": "Yes",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 1,
              "additionalInfo": {
                "displayInfo": "Yes"
              },
              "listingOrder": 1
            },
            {
              "id": 2,
              "text": "No",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 2,
              "additionalInfo": {
                "displayInfo": "No"
              },
              "listingOrder": 2
            }
          ],
          "listOrder": 1
        },
        {
          "id": 2,
          "description": "If your intended investment has an unrealised/paper loss of more than 30%, what would you do?",
          "text": null,
          "options": [
            {
              "id": 3,
              "text": "Sell all my investments",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 3,
              "additionalInfo": {
                "displayInfo": "Sell all"
              },
              "listingOrder": 1
            },
            {
              "id": 4,
              "text": "Sell some of my investments",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 4,
              "additionalInfo": {
                "displayInfo": "Sell some"
              },
              "listingOrder": 2
            },
            {
              "id": 5,
              "text": "Do nothing",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 5,
              "additionalInfo": {
                "displayInfo": "Do nothing"
              },
              "listingOrder": 3
            },
            {
              "id": 6,
              "text": "Top up my investments",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 6,
              "additionalInfo": {
                "displayInfo": "Top up"
              },
              "listingOrder": 4
            }
          ],
          "listOrder": 2
        },
        {
          "id": 3,
          "description": "If your intended investment fluctuates significantly, your stress level will be:",
          "text": null,
          "options": [
            {
              "id": 7,
              "text": "High",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 7,
              "additionalInfo": {
                "displayInfo": "High"
              },
              "listingOrder": 1
            },
            {
              "id": 8,
              "text": "Moderate",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 8,
              "additionalInfo": {
                "displayInfo": "Moderate"
              },
              "listingOrder": 2
            },
            {
              "id": 9,
              "text": "Low",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 9,
              "additionalInfo": {
                "displayInfo": "Low"
              },
              "listingOrder": 3
            },
            {
              "id": 10,
              "text": "No stress at all",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 10,
              "additionalInfo": {
                "displayInfo": "No stress"
              },
              "listingOrder": 4
            }
          ],
          "listOrder": 3
        },
        {
          "id": 4,
          "description": "Which of the following portfolio would you choose to invest in?",
          "text": null,
          "options": [
            {
              "id": 11,
              "text": "A",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 11,
              "additionalInfo": {
                "optimisticProjection": "4%",
                "pessimisticProjection": "-2%",
                "displayInfo": "A"
              },
              "listingOrder": 1
            },
            {
              "id": 12,
              "text": "B",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 12,
              "additionalInfo": {
                "optimisticProjection": "8%",
                "pessimisticProjection": "-5%",
                "displayInfo": "B"
              },
              "listingOrder": 2
            },
            {
              "id": 13,
              "text": "C",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 13,
              "additionalInfo": {
                "optimisticProjection": "12%",
                "pessimisticProjection": "-8%",
                "displayInfo": "C"
              },
              "listingOrder": 3
            },
            {
              "id": 14,
              "text": "D",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 14,
              "additionalInfo": {
                "optimisticProjection": "15%",
                "pessimisticProjection": "-13%",
                "displayInfo": "D"
              },
              "listingOrder": 4
            },
            {
              "id": 15,
              "text": "E",
              "optionType": "SINGLE_SELECT",
              "questionOptionId": 15,
              "additionalInfo": {
                "optimisticProjection": "19%",
                "pessimisticProjection": "-17%",
                "displayInfo": "E"
              },
              "listingOrder": 4
            }
          ],
          "listOrder": 4
        }
      ],
      "responseMessage": {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      }
    };
    investmentEngagementJourneyService.getQuestionsList()
      .subscribe((data: any) => {
        console.log(data);
        expect(data).toBe(questionsList);
      });

   

  });
});


