import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';

import { FormControl, FormGroup } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ci-assessment',
  templateUrl: './ci-assessment.component.html',
  styleUrls: ['./ci-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CiAssessmentComponent implements IPageComponent, OnInit, AfterViewInit {
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  pageTitle: string;
  mobileModalEvent: Event;
  ciAssessmentForm: FormGroup;
  ciAssessmentFormValues: any;
  ciCoverageAmt: any;
  ciMultiplier = 4;
  untilRetirementAge = 65;
  retirementAgeItems = Array(3).fill(55).map((x, i) => x += i * 5);
  helpModal: Event;
  helpModalTrigger: boolean;

  ciSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: (value) => {
        return Math.round(value);
      },
      from: (value) => {
        return Math.round(value);
      }
    }
  };

  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CI_ASSESSMENT.TITLE');
      this.setPageTitle(this.pageTitle, null, true);
    });
    this.ciAssessmentFormValues = {
      annualSalary: 0,
      coverageMultiplier: 0,
      untilRetirementAge: 0,
    };
  }

  ngOnInit() {
    this.ciAssessmentFormValues = this.guideMeService.getCiAssessment();
    let monthlySalary = this.guideMeService.getMyIncome().monthlySalary;
    if (!monthlySalary) {
      monthlySalary = 0;
    }
    this.ciAssessmentFormValues.annualSalary = monthlySalary * 12;
    if (this.ciAssessmentFormValues.ciMultiplier === undefined) {
      this.ciAssessmentFormValues.ciMultiplier = this.ciMultiplier;
    }
    this.ciAssessmentForm = new FormGroup({
      coverageAmt: new FormControl(this.ciAssessmentFormValues.coverageAmt),
      annualSalary: new FormControl(this.ciAssessmentFormValues.annualSalary),
      ciMultiplier: new FormControl(this.ciAssessmentFormValues.ciMultiplier),
      untilRetirementAge: new FormControl(this.ciAssessmentFormValues.untilRetirementAge)
    });
    this.ciCoverageAmt = this.ciAssessmentFormValues.annualSalary * this.ciAssessmentFormValues.ciMultiplier;
    this.headerService.currentMobileModalEvent.subscribe((event) => { if (event === 'Clicked') { this.showMobilePopUp(); } });
  }

  ngAfterViewInit() {
    this.ciMultiplierSlider.writeValue(this.ciAssessmentFormValues.ciMultiplier);
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  onSliderChange(value): void {
    this.ciMultiplier = value;
    this.ciCoverageAmt = this.ciAssessmentFormValues.annualSalary * this.ciMultiplier;
  }

  selectRetirementAge(count) {
    this.untilRetirementAge = count;
  }

  showMobilePopUp() {
    const ref = this.modal.open(HelpModalComponent, { centered: true, windowClass: 'help-modal-dialog' });
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.description = '<h4>Critical Illness</h4><p>This coverage replaces your income during recovery period (about 2-5 years) while you are unable to work. A person usually requires <b>Critical Illness</b> coverage till their intended retirement age.</p>';
    ref.componentInstance.title = 'Critical Illness';
    ref.componentInstance.img = assetImgPath + 'ci-assessment.png';
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setCiAssessment(form.value);
    }
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.OCCUPATIONAL_DISABILITY]);
    }
  }
}
