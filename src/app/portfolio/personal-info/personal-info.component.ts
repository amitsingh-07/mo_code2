import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';

import { PORTFOLIO_CONFIG } from '../../portfolio/portfolio.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInfoComponent implements OnInit, AfterViewInit, IPageComponent {
  @ViewChild('piInvestmentSlider') piInvestmentSlider: NouisliderComponent;
  personalInfoForm: FormGroup;
  pageTitle: string;
  formValues: any;
  ciAssessmentFormValues: any;
  sliderMinValue = 0;
  sliderMaxValue = PORTFOLIO_CONFIG.personal_info.max_investment_years;
  isSufficientInvYears = false;

  constructor(
    // tslint:disable-next-line
    private router: Router,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private config: NgbDatepickerConfig,
    private portfolioService: PortfolioService,
    private modal: NgbModal,
    private elRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter,
    public readonly translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PERSONAL_INFO.TITLE');
      this.setPageTitle(this.pageTitle);
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
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.portfolioService.getPersonalInfo();
    this.personalInfoForm = this.formBuilder.group({
      investmentPeriod: ['', Validators.required],
      sliderValueSetter: ['']
    });

    this.personalInfoForm.get('sliderValueSetter').valueChanges.subscribe((value) => {
      this.piInvestmentSlider.writeValue(value);
      this.onSliderChange(value);
    });
  }

  setPageTitle(title: string) {
    const stepLabel = this.translate.instant('PERSONAL_INFO.STEP_1_LABEL');
    this.navbarService.setPageTitle(
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      stepLabel
    );
  }

  onSliderChange(value): void {
    const self = this;
    setTimeout(() => {
      self.personalInfoForm.controls.investmentPeriod.setValue(value);
      const pointerPosition = self.elRef.nativeElement.querySelectorAll('.noUi-origin')[0]
        .style.transform;
      self.elRef.nativeElement.querySelectorAll(
        '.pointer-container'
      )[0].style.transform = pointerPosition;
    }, 1);
    this.isSufficientInvYears =
      value > PORTFOLIO_CONFIG.personal_info.min_investment_period ? true : false;
    this.cd.detectChanges();
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
      ref.componentInstance.errorTitle = this.portfolioService.currentFormError(form)[
        'errorTitle'
      ];
      ref.componentInstance.errorMessage = this.portfolioService.currentFormError(form)[
        'errorMessage'
      ];
      return false;
    }
    this.portfolioService.setPersonalInfo(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.MY_FINANCIALS]);
    }
  }
}
