import {
  ModelWithButtonComponent
} from 'src/app/shared/modal/model-with-button/model-with-button.component';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  AccountCreationErrorModalComponent
} from '../../investment-common/confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';

@Component({
  selector: 'app-funding-account-details',
  templateUrl: './funding-account-details.component.html',
  styleUrls: ['./funding-account-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingAccountDetailsComponent implements OnInit {
  pageTitle: string;
  formValues;
  fundingMethods = ['Cash', 'SRS'];
  srsOperatorList = ['a', 'b', 'c'];
  fundingAccountDetailsFrom: FormGroup;

  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Confirm Account Details');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.investmentAccountService.getFundingMethod();
    this.fundingAccountDetailsFrom = this.buildForm();
    this.addAndRemoveSrsForm(this.fundingAccountDetailsFrom.get('fundingAccountMethod').value);

  }

  buildForm() {
    return this.formBuilder.group({
      fundingAccountMethod: [this.formValues.fundingMethod, Validators.required]
    });
  }
  addAndRemoveSrsForm(FundingMethod) {
    if (FundingMethod === 'SRS') {
      this.buildForSrsForm();
    }
    this.observeFundingMethodChange();
  }

  buildForSrsForm() {
    this.fundingAccountDetailsFrom.addControl(
      'srsFundingDetails', this.formBuilder.group({
        srsOperatorBank: ['', Validators.required],
        srsAccountNumber: ['', Validators.required],
      })
    );
  }

 observeFundingMethodChange() {
    this.fundingAccountDetailsFrom
      .get('fundingAccountMethod')
      .valueChanges.subscribe((value) => {
        this.addAndRemoveSrsForm(value);
      });
  }

  selectSource(key, value) {
    this.fundingAccountDetailsFrom.controls[key].setValue(value);
  }
  selectSrsOperator(key, value, nestedKey) {
    this.fundingAccountDetailsFrom.controls[nestedKey]['controls'][key].setValue(value);
  }

  changingFundMethod() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('Reassess the Risk profile');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant('you want change the risk fund method you can risk  reassess the risk profile');
    ref.componentInstance.yesOrNoButton = true;
    ref.componentInstance.closeBtn = false;
    ref.componentInstance.yesClickAction.subscribe((emittedValue) => {
      ref.close();
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
    });
    ref.componentInstance.noClickAction.subscribe((emittedValue) => {
      ref.close();
    });
  }
  goToNext(form) {
    if (!form.valid) {
      return false;
    } else if (this.investmentAccountService.setAdditionDeclaration(form.getRawValue())) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
    }
  }

}
