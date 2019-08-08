import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../shared/logger/logger.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../engagement-journey-routes.constants';
import { ENGAGEMENT_JOURNEY_CONSTANTS } from '../engagement-journey.constants';
import { EngagementJourneyService } from '../engagement-journey.service';
import { QuestionIcons } from './questionicon';

@Component({
  selector: 'app-risk-willingness',
  templateUrl: './risk-willingness.component.html',
  styleUrls: ['./risk-willingness.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RiskWillingnessComponent implements IPageComponent, OnInit {
  pageTitle: string;
  QuestionLabel: string;
  ofLabel: string;
  riskAssessmentForm: FormGroup;
  riskFormValues: any;
  questionsList: any[] = [];
  questionIndex: number;
  currentQuestion: any;
  isSpecialCase = false;
  iconImage;

  constructor(
    private EngagementJourneyService: EngagementJourneyService,
    private route: ActivatedRoute,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    public log: LoggerService,
    private investmentAccountService: InvestmentAccountService
  ) {
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
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.riskFormValues = this.EngagementJourneyService.getPortfolioFormData();
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
    const stepLabel = this.translate.instant('RISK_ASSESSMENT.STEP_2_LABEL');
    this.navbarService.setPageTitle(
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      stepLabel
    );
  }

  getQuestions() {
    this.EngagementJourneyService.getQuestionsList().subscribe((data) => {
      this.questionsList = data.objectList;
      this.setCurrentQuestion();
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  setCurrentQuestion() {
    this.currentQuestion = this.questionsList[this.questionIndex - 1];
    this.iconImage = QuestionIcons[this.questionIndex - 1]['icon'];
    // tslint:disable-next-line
    // this.isChartAvailable = (this.currentQuestion.questionType === 'RISK_ASSESSMENT') ? true : false;
    this.isSpecialCase = this.currentQuestion.listOrder === ENGAGEMENT_JOURNEY_CONSTANTS.risk_assessment.special_question_order ? true : false;
    const selectedOption = this.EngagementJourneyService.getSelectedOptionByIndex(
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
      this.EngagementJourneyService.setRiskAssessment(
        form.controls.questSelOption.value,
        this.questionIndex
      );
      if (this.questionIndex < this.questionsList.length) {
        // NEXT QUESTION
        this.router.navigate([
          ENGAGEMENT_JOURNEY_ROUTE_PATHS.RISK_ASSESSMENT + '/' + (this.questionIndex + 1)
        ]);
      } else {
        // RISK PROFILE
        // CALL API
        this.EngagementJourneyService.saveRiskAssessment().subscribe((data) => {
          this.EngagementJourneyService.setRiskProfile(data.objectList);
          this.EngagementJourneyService.setPortfolioSplashModalCounter(0);
          this.router.navigate([ENGAGEMENT_JOURNEY_ROUTE_PATHS.RISK_PROFILE]);
        },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
      }
    }
  }
}
