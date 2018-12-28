import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../shared/logger/logger.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PORTFOLIO_CONFIG } from '../portfolio.constants';
import { PortfolioService } from '../portfolio.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RiskAssessmentComponent implements IPageComponent, OnInit {

  pageTitle: string;
  QuestionLabel: string;
  ofLabel: string;
  riskAssessmentForm: FormGroup;
  riskFormValues: any;
  questionsList: any[] = [];
  questionIndex: number;
  currentQuestion: any;
  isSpecialCase = false;
  chartLegendEnum = PORTFOLIO_CONFIG.risk_assessment.chart_legend;

  constructor(
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router,
    public navbarService: NavbarService,
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    public log: LoggerService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RISK_ASSESSMENT.TITLE');
      this.QuestionLabel = this.translate.instant('RISK_ASSESSMENT.QUESTION_LBL');
      this.ofLabel = this.translate.instant('RISK_ASSESSMENT.OF_LBL');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.riskFormValues = this.portfolioService.getPortfolioFormData();
    const self = this;
    this.route.params.subscribe((params) => {
      self.questionIndex = +params['id'];
      this.riskAssessmentForm = new FormGroup({
        questSelOption: new FormControl(this.riskFormValues.questSelectedOption, Validators.required)
      });
      if (!self.questionsList.length) {
        self.getQuestions();
      } else {
        self.setCurrentQuestion();
      }
    });
  }

  setPageTitle(title: string) {
    const stepLabel = this.translate.instant('RISK_ASSESSMENT.STEP_2_LABEL');
    this.navbarService.setPageTitle(title, undefined, undefined, undefined, undefined, stepLabel);
  }

  getQuestions() {
    this.portfolioService.getQuestionsList().subscribe((data) => {
      const mockData = {
        "exception": null,
        "objectList": [{
          "id": 1,
          "description": "Investing carries risk. I am willing to accept temporary losses in the short term to achieve investment gains in the longer term.",
          "text": null,
          "options": [{
            "id": 1,
            "text": "Yes",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 1,
            "customUserInput": null,
            "listingOrder": 1
          }, {
            "id": 2,
            "text": "No",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 2,
            "customUserInput": null,
            "listingOrder": 2
          }],
          "listOrder": 1
        }, {
          "id": 2,
          "description": "If your intended investment has an unrealised/paper loss of more than 30%, what would you do?",
          "text": null,
          "options": [{
            "id": 5,
            "text": "Sell all my investment",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 5,
            "customUserInput": null,
            "listingOrder": 1
          }, {
            "id": 6,
            "text": "Sell some of my investment",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 6,
            "customUserInput": null,
            "listingOrder": 2
          }, {
            "id": 7,
            "text": "Do nothing",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 7,
            "customUserInput": null,
            "listingOrder": 3
          }, {
            "id": 8,
            "text": "Buy more investment",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 8,
            "customUserInput": null,
            "listingOrder": 4
          }],
          "listOrder": 2
        }, {
          "id": 3,
          "description": "If your intended investment fluctuates significantly, your stress level will be:",
          "text": null,
          "options": [{
            "id": 9,
            "text": "High",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 9,
            "customUserInput": null,
            "listingOrder": 1
          }, {
            "id": 10,
            "text": "Moderate",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 10,
            "customUserInput": null,
            "listingOrder": 2
          }, {
            "id": 11,
            "text": "Low",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 11,
            "customUserInput": null,
            "listingOrder": 3
          }, {
            "id": 12,
            "text": "No stress at all",
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 12,
            "customUserInput": null,
            "listingOrder": 4
          }],
          "listOrder": 3
        }, {
          "id": 4,
          "description": "Which of the following portfolio would you choose to invest in?",
          "text": null,
          "options": [{
            "id": 9,
            "text": "A",
            "additionalInfo": {
              "optimistic": "5%",
              "pessimistic": "-2%"
            },
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 13,
            "customUserInput": null,
            "listingOrder": 1
          }, {
            "id": 10,
            "text": "B",
            "additionalInfo": {
              "optimistic": "8%",
              "pessimistic": "-5%"
            },
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 14,
            "customUserInput": null,
            "listingOrder": 2
          }, {
            "id": 11,
            "text": "C",
            "additionalInfo": {
              "optimistic": "12%",
              "pessimistic": "-8%"
            },
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 15,
            "customUserInput": null,
            "listingOrder": 3
          }, {
            "id": 12,
            "text": "D",
            "additionalInfo": {
              "optimistic": "15%",
              "pessimistic": "-13%"
            },
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 16,
            "customUserInput": null,
            "listingOrder": 4
          }, {
            "id": 13,
            "text": "E",
            "additionalInfo": {
              "optimistic": "19%",
              "pessimistic": "-17%"
            },
            "description": null,
            "optionType": "SINGLE_SELECT",
            "questionOptionId": 17,
            "customUserInput": null,
            "listingOrder": 4
          }],
          "listOrder": 4
        }],
        "responseMessage": {
          "responseCode": 6000,
          "responseDescription": "Successful response"
        }
      };
      this.questionsList = data.objectList;
      this.setCurrentQuestion();
    });
  }

  setCurrentQuestion() {
    this.currentQuestion = this.questionsList[this.questionIndex - 1];
    // tslint:disable-next-line
    // this.isChartAvailable = (this.currentQuestion.questionType === 'RISK_ASSESSMENT') ? true : false;
    this.isSpecialCase = this.currentQuestion.listOrder === 4 ? true : false;
    const selectedOption = this.portfolioService.getSelectedOptionByIndex(this.questionIndex);
    if (selectedOption) {
      this.riskAssessmentForm.controls.questSelOption.setValue(selectedOption);
    }
  }

  setLegend(id) {
    return this.chartLegendEnum[id];
  }

  save(form): boolean {
    if (!form.valid) {
      return false;
    } else {
      return true;
    }
  }

  goToNext(form) {
    if (this.save(form)) {
      this.portfolioService.setRiskAssessment(form.controls.questSelOption.value, this.questionIndex);
      if (this.questionIndex < this.questionsList.length) {
        // NEXT QUESTION
        this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT + '/' + (this.questionIndex + 1)]);
      } else {
        // RISK PROFILE
        // CALL API
        this.portfolioService.saveRiskAssessment().subscribe((data) => {
          this.portfolioService.setRiskProfile(data.objectList);
          this.portfolioService.setPortfolioSplashModalCounter(0);
          this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_PROFILE]);
        });
      }
    }
  }
}
