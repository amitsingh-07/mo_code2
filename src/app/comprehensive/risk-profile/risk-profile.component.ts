import { ConfigService } from './../../config/config.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


import { Subscription } from 'rxjs';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
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
  viewMode: boolean;

  constructor(
    public navbarService: NavbarService,
    public readonly translate: TranslateService,
    private comprehensiveApiService: ComprehensiveApiService,
    private comprehensiveService: ComprehensiveService,
    private progressService: ProgressTrackerService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService
  ) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
          // meta tag and title
          this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_4_TITLE_LITE');
          this.setPageTitle(this.pageTitle);
      });
  });
    this.pageId = this.route.routeConfig.component.name;
    this.viewMode = this.comprehensiveService.getViewableMode();
    const self = this;
    this.route.params.subscribe((params) => {
      self.questionIndex = +params['id'];
      this.riskAssessmentForm = new FormGroup({
        questSelOption: new FormControl('', Validators.required)
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
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
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

    this.currentQuestion = this.questionsList[this.questionIndex - 1];
    this.isSpecialCase = this.currentQuestion.listOrder ===
      COMPREHENSIVE_CONST.RISK_ASSESSMENT.SPECIAL_QUESTION_ORDER ? true : false;
    const selectedOption = this.comprehensiveService.getSelectedOptionByIndex(
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
      this.comprehensiveService.setRiskAssessment(
        form.controls.questSelOption.value,
        this.questionIndex
      );
      if (this.questionIndex < this.questionsList.length) {
        // NEXT QUESTION
        this.comprehensiveService.saveRiskAssessment().subscribe((data) => {
          this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
          this.router.navigate([
            COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/' + (this.questionIndex + 1)
          ]);
        });
      } else {

        this.comprehensiveService.saveRiskAssessment().subscribe((data) => {
          const routerURL = this.viewMode ? COMPREHENSIVE_ROUTE_PATHS.DASHBOARD
          : COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT;
          this.router.navigate([routerURL]);
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
