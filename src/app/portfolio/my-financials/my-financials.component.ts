import { CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';
import { portfolioConstants } from '../../portfolio/portfolio.constants';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from './../portfolio.service';
import { IMyFinancials } from './my-financials.interface';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-my-financials',
  templateUrl: './my-financials.component.html',
  styleUrls: ['./my-financials.component.scss']
})
export class MyFinancialsComponent implements IPageComponent, OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  modalData: any;
  heplDate: any;
  pageTitle: string;
  form: any;

  constructor(
    private router: Router,
    private modal: NgbModal,
    private portfolioService: PortfolioService,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('MY_FINANCIALS.TITLE');
      self.modalData = this.translate.instant('MY_FINANCIALS.modalData');
      self.heplDate = this.translate.instant('MY_FINANCIALS.heplDate');
      this.setPageTitle(self.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  ngOnInit() {
    this.myFinancialsFormValues = this.portfolioService.getMyFinancials();

    this.myFinancialsForm = new FormGroup({
      monthlyIncome: new FormControl(this.myFinancialsFormValues.monthlyIncome, Validators.required),
      percentageOfSaving: new FormControl(this.myFinancialsFormValues.percentageOfSaving, Validators.required),
      totalAssets: new FormControl(this.myFinancialsFormValues.totalAssets, Validators.required),
      totalLiabilities: new FormControl(this.myFinancialsFormValues.totalLiabilities, Validators.required),
      initialInvestment: new FormControl(this.myFinancialsFormValues.initialInvestment, Validators.required),
      monthlyInvestment: new FormControl(this.myFinancialsFormValues.monthlyInvestment, Validators.required),
      suffEmergencyFund: new FormControl(portfolioConstants.my_financials.sufficient_emergency_fund, Validators.required)

    });
  }

  showEmergencyFundModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
  }
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.heplDate.modalTitle;
    ref.componentInstance.errorMessage = this.heplDate.modalMessage;
    return false;
  }

  save(form: any) {
    this.portfolioService.setMyFinancials(form.value);
    this.authService.authenticate().subscribe((token) => {
      this.portfolioService.savePersonalInfo().subscribe((data) => {
        // capture enquiry id
      });
    });
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP2]);
    }
  }
}
