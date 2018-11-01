import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import {
  BreakdownAccordionComponent
} from '../../shared/components/breakdown-accordion/breakdown-accordion.component';
import {
  BreakdownBarComponent
} from '../../shared/components/breakdown-bar/breakdown-bar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';
import {
  EditInvestmentModalComponent
} from './edit-investment-modal/edit-investment-modal.component';
import { FeesModalComponent } from './fees-modal/fees-modal.component';

@Component({
  selector: 'app-confirm-portfolio',
  templateUrl: './confirm-portfolio.component.html',
  styleUrls: ['./confirm-portfolio.component.scss']
})
export class ConfirmPortfolioComponent implements OnInit {

  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  isUserNationalitySingapore;
  defaultThumb;
  showLoader;
  loaderTitle;
  loaderDesc;
  formData: FormData = new FormData();
  portfolio;

  breakdownSelectionindex: number = null;
  isAllocationOpen = false;

  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CONFIRM_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const params = this.constructgetPortfolioParams();
    this.investmentAccountService.getPortfolioAllocationDetails(params).subscribe((data) => {
      this.portfolio = data.objectList;
    });
  }

  constructgetPortfolioParams() {
    /* TODO: this will be removed */
    return {
      riskProfileId: 4,
      enquiryId: 5931
    };
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.uploadForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }

  selectAllocation(event) {
    if ((!this.isAllocationOpen)) {
      this.breakdownSelectionindex = event;
      this.isAllocationOpen = true;
    } else {
      if (event !== this.breakdownSelectionindex) {
        // different tab
        this.breakdownSelectionindex = event;
        this.isAllocationOpen = true;
      } else {
        // same tab click
        this.breakdownSelectionindex = null;
        this.isAllocationOpen = false;
      }
    }
  }

  showPortfolioAssetModal() {
    const errorTitle = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.TITLE');
    const errorMessage = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.MESSAGE');
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessageHTML = errorMessage;
  }

  showFeesModal() {
    const ref = this.modal.open(FeesModalComponent, { centered: true });
  }

  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      investmentPeriod: 5,
      oneTimeInvestment: 12000,
      monthlyInvestment: 1000
    };
    ref.componentInstance.modifiedInvestmentData.subscribe((emittedValue) => {
      // update form data
      ref.close();
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

  goToWhatsTheRisk() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  goToNext() {
    const pepData = this.investmentAccountService.getPepData();
    // tslint:disable-next-line:triple-equals
    if (pepData == true) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
    } else {
      this.investmentAccountService.createInvestmentAccount();
      //this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_LATER]);
    }

  }

}
