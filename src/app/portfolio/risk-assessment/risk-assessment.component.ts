import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../shared/logger/logger.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';
import { ActivatedRoute } from '@angular/router';

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
  isChartAvailable: boolean = false;
  chartLegendEnum = {
    1: "vhfvhr",
    2: "hfhr",
    3: "mfmr",
    4: "lflr"
  }

  constructor(
    private portfolioService: PortfolioService, private route: ActivatedRoute, private router: Router,
    private modal: NgbModal, public headerService: HeaderService,
    public readonly translate: TranslateService, public authService: AuthenticationService,
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
    let self = this;
    this.route.params.subscribe(params => {
      self.questionIndex = +params['id'];
      this.riskAssessmentForm = new FormGroup({
        questSelOption: new FormControl(this.riskFormValues.questSelectedOption, Validators.required)
      });
      if (!self.questionsList.length) {
        self.getQuestions();
      }
      else {
        self.setCurrentQuestion();
      }
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }



  getQuestions() {
    this.portfolioService.getQuestionsList().subscribe((data) => {
      this.questionsList = data.objectList;
      this.setCurrentQuestion();
    });
    // this.authService.authenticate().subscribe((token) => {
    // });
  }

  setCurrentQuestion() {
    this.currentQuestion = this.questionsList[this.questionIndex - 1];
    this.isChartAvailable = (this.currentQuestion.questionType == "RISK_ASSESSMENT") ? true : false;
    let selectedOption = this.portfolioService.getSelectedOptionByIndex(this.questionIndex);
    if (selectedOption) {
      this.riskAssessmentForm.controls.questSelOption.setValue(selectedOption.questSelOption);
    }
  }

  setLegend(id) {
    return this.chartLegendEnum[id];
  }

  save(form): boolean {
    if (!form.valid) {
      return false;
    }
    else {
      return true;
    }

  }

  goToNext(form) {
    console.log("calling next...");
    if (this.save(form)) {
      this.portfolioService.setRiskAssessment(form.value, this.questionIndex);
      if (this.questionIndex < this.questionsList.length) {
        //NEXT QUESTION
        this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT + "/" + (this.questionIndex + 1)]);
      }
      else {
        //RISK PROFILE
        //CALL API
        this.portfolioService.saveRiskAssessment().subscribe((data) => {
          this.portfolioService.setRiskProfile(data.objectList);
          this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_PROFILE]);
        });
      }
    }
  }
}
