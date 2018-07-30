import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { HeaderService } from './../../shared/header/header.service';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ci-assessment',
  templateUrl: './ci-assessment.component.html',
  styleUrls: ['./ci-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CiAssessmentComponent implements IPageComponent, OnInit {
  @ViewChild('incomeSlider') incomeSlider: jqxSliderComponent;
  pageTitle: string;
  mobileModalEvent: Event;
  critIllnessForm: FormGroup;
  critIllnessFormValues: any;
  ciMultiplier = 4;
  retirementAge = 65;
  retirementAgeItems = Array(3).fill(55).map((x, i) => x += i * 5);
  helpModal: Event;
  helpModalTrigger: boolean;

  constructor(private guideMeService: GuideMeService, private router: Router,
              public modal: NgbModal, public headerService: HeaderService,
              public readonly translate: TranslateService) {
                this.translate.use('en');
                this.pageTitle = this.translate.instant('CRITICAL_ILLNESS_ASSESSMENT.TITLE');
                this.setPageTitle(this.pageTitle, null, true);
                this.critIllnessFormValues = {
                  annualSalary: 0,
                  coverageMultiplier: 0,
                  retirementAge: 0,
                  };
  }

  ngOnInit() {
    this.critIllnessForm = new FormGroup({
      annualSalary: new FormControl(this.critIllnessFormValues.annualSalary)
    });
    this.headerService.initMobilePopUp();
    this.headerService.currentMobileModalEvent.subscribe((Event) => this.showMobilePopUp());
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  onSliderChange(): void {
    this.ciMultiplier = this.incomeSlider.getValue();
  }

  showMobilePopUp() {
    console.log('Show Mobile Popup Triggered');
    const ref = this.modal.open(HelpModalComponent, { centered: true, windowClass: 'help-modal-dialog' });
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.description = '<h4>Critical Illness</h4><p>This coverage replaces your income during recovery period (about 2-5 years) while you are unable to work. A person usually requires <b>Critical Illness</b> coverage till their intended retirement age.</p>';
    ref.componentInstance.title = 'Critical Illness';
    ref.componentInstance.img = assetImgPath + 'ci-assessment.png';
  }
}
