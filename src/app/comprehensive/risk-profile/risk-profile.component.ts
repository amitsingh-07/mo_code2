import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentEngagementJourneyService } from './../../investment/investment-engagement-journey/investment-engagement-journey.service';

import { Subscription } from 'rxjs';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements IPageComponent, OnInit {

  pageTitle: any;
  pageId: string;
  QuestionLabel: string;
  ofLabel: string;
  riskAssessmentForm: FormGroup;
  riskFormValues: any;
  questionsList: any[] = [];
  questionIndex: number;
  currentQuestion: any;
  isSpecialCase = false;
  question1 = true;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  isRiskProfileAnswer: boolean;
  riskProfileAnswers: any;

  constructor(
    public navbarService: NavbarService,
    public readonly translate: TranslateService,
    private comprehensiveApiService: ComprehensiveApiService,
    private comprehensiveService: ComprehensiveService,
    private progressService: ProgressTrackerService,
    private route: ActivatedRoute,
    private router: Router,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Your Risk Profile');
      this.setPageTitle(this.pageTitle);
    });
    //this.comprehensiveService.setRiskAssessmentAnswers();
    this.pageId = this.route.routeConfig.component.name;
    const self = this;
    this.route.params.subscribe((params) => {
      self.questionIndex = +params['id'];
      this.riskAssessmentForm = new FormGroup({
        questSelOption: new FormControl('',  Validators.required)
      });
      if (!self.questionsList.length) {
        self.getQuestions();
      } else {
        self.setCurrentQuestion();
      }
    });
  }

  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    //this.navbarService.setNavbarDirectGuided(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe(
      (pageId) => {
        if (this.pageId === pageId) {
          this.progressService.show();
        }
      }
    );
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
      }
    });

  
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, {
      id: this.pageId,
      iconClass: 'navbar__menuItem--journey-map'
    });
  }
  getQuestions() {
    this.comprehensiveService.getQuestionsList().subscribe((data) => {
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
    this.isSpecialCase = this.currentQuestion.listOrder ===
    INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.risk_assessment.special_question_order ? true : false;
    const selectedOption = this.comprehensiveService.getSelectedOptionByIndex(
      this.questionIndex
    );
    if (selectedOption) {
      this.riskAssessmentForm.controls.questSelOption.setValue( selectedOption);
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
      this.comprehensiveService.setRiskAssessment(
        form.controls.questSelOption.value,
        this.questionIndex
      );
      if (this.questionIndex < this.questionsList.length) {
        // NEXT QUESTION
        // const payload = this.investmentEngagementJourneyService.getPortfolioFormData();

        // this.comprehensiveService.setRiskAssessment(payload);
        this.comprehensiveService.saveRiskAssessment().subscribe((data) => {

          this.router.navigate([
            COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/' + (this.questionIndex + 1)
          ]);
        });
      } else {
        // RISK PROFILE
        // CALL API
        // const payload = this.investmentEngagementJourneyService.getPortfolioFormData();

        // this.comprehensiveService.setRiskAssessment(payload);
        this.comprehensiveService.saveRiskAssessment().subscribe((data) => {

          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REVIEW]);
        });
      }
    }
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.subscription.unsubscribe();
  }
}
