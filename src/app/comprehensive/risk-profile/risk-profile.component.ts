import { ComprehensiveApiService } from './../comprehensive-api.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { QuestionIcons } from '../../investment/investment-engagement-journey/risk-willingness/questionicon';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements IPageComponent, OnInit {

  pageTitle: string;
  QuestionLabel: string;
  ofLabel: string;
  riskAssessmentForm: FormGroup;
  riskFormValues: any;
  questionsList: any[] = [];
  questionIndex: number;
  currentQuestion: any;
  isSpecialCase = false;
  question1 = true;

  constructor(
    public navbarService: NavbarService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public readonly translate: TranslateService,
    private comprehensiveApiService: ComprehensiveApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Your Risk Profile');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    //this.navbarService.setNavbarDirectGuided(true);
    this.riskFormValues = this.investmentEngagementJourneyService.getPortfolioFormData();
    const self = this;
    this.route.params.subscribe((params) => {
      self.questionIndex = +params['id'];
      this.riskAssessmentForm = new FormGroup({
        questSelOption: new FormControl(
          this.riskFormValues.questSelectedOption,
          Validators.required
        )
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
    this.investmentEngagementJourneyService.getQuestionsList().subscribe((data) => {
      this.questionsList = data.objectList;
      this.setCurrentQuestion();
    });
  }
  setCurrentQuestion() {
    // this.questionIndex = 1;
    // this.questionIndex = 2;
    // this.questionIndex = 3;
    this.currentQuestion = this.questionsList[this.questionIndex - 1];

    // tslint:disable-next-line
    // this.isChartAvailable = (this.currentQuestion.questionType === 'RISK_ASSESSMENT') ? true : false;
    this.isSpecialCase = this.currentQuestion.listOrder === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.risk_assessment.special_question_order ? true : false;
    const selectedOption = this.investmentEngagementJourneyService.getSelectedOptionByIndex(
      this.questionIndex
    );
    if (selectedOption) {
      this.riskAssessmentForm.controls.questSelOption.setValue(selectedOption);
    }
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
      this.investmentEngagementJourneyService.setRiskAssessment(
        form.controls.questSelOption.value,
        this.questionIndex
      );
      if (this.questionIndex < this.questionsList.length) {
        // NEXT QUESTION
        this.router.navigate([
          COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/' + (this.questionIndex + 1)
        ]);
      } else {
        // RISK PROFILE
        // CALL API
        this.investmentEngagementJourneyService.saveRiskAssessment().subscribe((data) => {
          //this.investmentEngagementJourneyService.setRiskProfile(data.objectList);
          //this.investmentEngagementJourneyService.setPortfolioSplashModalCounter(0);
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE]);
        });
      }
    }
  }
}
