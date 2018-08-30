import { Component, OnInit, ElementRef  } from '@angular/core';

import { AfterViewInit, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup } from '../../../../node_modules/@angular/forms';
//import { Router } from '../../../../node_modules/@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { PORTFOLIO_ROUTES, PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from './../portfolio.service';
const assetImgPath = './assets/images/';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  //   providers: [ provide: NgbDateParserFormatter],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInfoComponent implements OnInit {
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  personalInfoForm: FormGroup;
  pageTitle: string;
  formValues: any;
  dateOfBirth: string;
  ciAssessmentFormValues: any;
  sliderMinValue:number = 4;
  sliderMaxValue:number = 99;
  pointerPositionScale;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    private config: NgbDatepickerConfig,
    private portfolioService: PortfolioService,
    private modal: NgbModal,
    private elRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PERSONAL_INFO.TITLE');
      this.setPageTitle(this.pageTitle);
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    });
  }
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


  ngOnInit() {
    this.formValues = this.portfolioService.getPersonalInfo();
    this.personalInfoForm = this.formBuilder.group({
      dateOfBirth: [this.formValues.dateOfBirth, Validators.required],
      investmentPeriod: [this.formValues.investmentPeriod, Validators.required],
    });
  }


  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  
  onSliderChange(value): void {
    this.elRef.nativeElement.querySelectorAll('.pointer-container')[0].style.transform = this.elRef.nativeElement.querySelectorAll('.noUi-origin')[0].style.transform;
    this.personalInfoForm.controls.investmentPeriod.setValue(value);
  }

  save(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.portfolioService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.portfolioService.currentFormError(form)['errorMessage'];
      return false; 
    }
    form.value.customDob = this.parserFormatter.format(form.value.dateOfBirth);

    this.portfolioService.setUserInfo(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.MY_FINANCIALS])
    }
  }

}
