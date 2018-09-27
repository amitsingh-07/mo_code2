import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { CriticalIllnessData } from './ci-assessment';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ci-assessment',
  templateUrl: './ci-assessment.component.html',
  styleUrls: ['./ci-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CiAssessmentComponent implements IPageComponent, OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  pageTitle: string;
  mobileModalEvent: Event;
  ciAssessmentForm: FormGroup;
  ciAssessmentFormValues: CriticalIllnessData;
  ciCoverageAmt: any;
  ciMultiplier = 4;
  untilRetirementAge = 65;
  retirementAgeItems = Array(3).fill(55).map((x, i) => x += i * 5);
  helpModal: Event;
  helpModalTrigger: boolean;
  modalData;
  pageData;

  private subscription: Subscription;

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
    public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CI_ASSESSMENT.TITLE');
      this.pageData = this.translate.instant('CI_ASSESSMENT');
      this.modalData = this.translate.instant('CI_ASSESSMENT.MODAL_DATA');
      this.setPageTitle(this.pageTitle, null, true);
    });
  }

  ngOnInit() {
    this.ciAssessmentFormValues = this.guideMeService.getCiAssessment();
    this.untilRetirementAge = this.ciAssessmentFormValues.coverageYears;
    let monthlySalary = this.guideMeService.getMyIncome().monthlySalary;
    if (!monthlySalary) {
      monthlySalary = 0;
    }
    this.ciAssessmentFormValues.annualSalary = monthlySalary * 12;
    if (this.ciAssessmentFormValues.ciMultiplier === undefined) {
      this.ciAssessmentFormValues.ciMultiplier = this.ciMultiplier;
    }
    this.ciAssessmentForm = new FormGroup({
      coverageAmount: new FormControl(this.ciAssessmentFormValues.coverageAmount),
      annualSalary: new FormControl(this.ciAssessmentFormValues.annualSalary),
      ciMultiplier: new FormControl(this.ciAssessmentFormValues.ciMultiplier),
      coverageYears: new FormControl(this.ciAssessmentFormValues.coverageYears)
    });
    this.ciCoverageAmt = this.ciAssessmentFormValues.annualSalary * this.ciAssessmentFormValues.ciMultiplier;
    // tslint:disable-next-line:max-line-length
    this.subscription = this.headerService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showMobilePopUp();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.ciMultiplierSlider.writeValue(this.ciAssessmentFormValues.ciMultiplier);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.decrementProtectionNeedsIndex();
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
    const ref = this.modal.open(HelpModalComponent, {
      centered: true,
      windowClass: 'help-modal-dialog'
    });
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.description = this.modalData.description;
    ref.componentInstance.title = this.modalData.title;
    ref.componentInstance.img = assetImgPath + this.modalData.imageName;
    this.headerService.showMobilePopUp('removeClicked');
  }

  save(form: any) {
    if (form.valid) {
      this.ciAssessmentForm.controls.coverageYears.setValue(this.untilRetirementAge);
      this.ciAssessmentForm.controls.coverageAmount.setValue(this.ciCoverageAmt);
      this.ciAssessmentForm.controls.ciMultiplier.setValue(this.ciMultiplier);
      this.guideMeService.setCiAssessment(form.value);
    }
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.incrementProtectionNeedsIndex();
      });
    }
  }
}
