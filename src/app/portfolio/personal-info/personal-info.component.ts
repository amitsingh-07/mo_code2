import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';

import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_CONFIG } from '../../portfolio/portfolio.constants';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInfoComponent implements OnInit, AfterViewInit, IPageComponent {
  @ViewChild('piInvestmentSlider') piInvestmentSlider: NouisliderComponent;
  personalInfoForm: FormGroup;
  pageTitle: string;
  formValues: any;
  ciAssessmentFormValues: any;
  sliderMinValue = 0;
  sliderMaxValue = 99;
  sliderDesc: string;
  dob: string;

  constructor(
    // tslint:disable-next-line
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
    animate: false,
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

  ngAfterViewInit() {
    this.piInvestmentSlider.writeValue(this.formValues.investmentPeriod);
    this.onSliderChange(this.formValues.investmentPeriod);
  }

  ngOnInit() {
    this.formValues = this.portfolioService.getPersonalInfo();
    this.personalInfoForm = this.formBuilder.group({
      dob: [this.formValues.dob, Validators.required],
      investmentPeriod: [this.formValues.investmentPeriod, Validators.required],
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  onSliderChange(value): void {
    this.setSliderDescByRange(value);
    this.personalInfoForm.controls.investmentPeriod.setValue(value);
    const self = this;
    setTimeout( () => {
      const pointerPosition = self.elRef.nativeElement.querySelectorAll('.noUi-origin')[0].style.transform;
      self.elRef.nativeElement.querySelectorAll('.pointer-container')[0].style.transform = pointerPosition;
    }, 1);

  }

  setSliderDescByRange(value) {
    const ranges = PORTFOLIO_CONFIG.personal_info.range_with_desc;
    ranges.forEach((range) => {
      if (this.isValueBetweenRange(value, range.min, range.max)) {
        this.sliderDesc = this.translate.instant(range.content);
      }
    });

  }

  isValueBetweenRange(x, min, max) {
    return x > min && x <= max;
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
    form.value.dob = this.parserFormatter.format(form.value.dob);
    this.portfolioService.setPersonalInfo(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.MY_FINANCIALS]);
    }
  }

}
