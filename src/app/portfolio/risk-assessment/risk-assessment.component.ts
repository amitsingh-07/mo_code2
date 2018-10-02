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
  isChartAvailable = false;
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
    this.navbarService.setPageTitle(title);
  }

  getQuestions() {
    this.portfolioService.getQuestionsList().subscribe((data) => {
      this.questionsList = data.objectList;
      this.setCurrentQuestion();
    });
  }

  setCurrentQuestion() {
    this.currentQuestion = this.questionsList[this.questionIndex - 1];
    // tslint:disable-next-line
    // this.isChartAvailable = (this.currentQuestion.questionType === 'RISK_ASSESSMENT') ? true : false;
    this.isChartAvailable = this.currentQuestion.listOrder === 5 ? true : false;
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
