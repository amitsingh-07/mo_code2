import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../manage-investments-routes.constants';

import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpApiService } from '../../../sign-up/sign-up.api.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ManageInvestmentsService } from '../manage-investments.service';

@Component({
  selector: 'app-withdrawal-status',
  templateUrl: './withdrawal-status.component.html',
  styleUrls: ['./withdrawal-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalStatusComponent implements OnInit, OnDestroy {
  formValues;
  topupportfolioamount;
  topupFormValues;
  requestReceivecd;
  fundDetails;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public manageInvestmentsService: ManageInvestmentsService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    document.body.classList.add('bg-color');
    this.navbarService.setNavbarVisibility(false);
    this.navbarService.setNavbarMobileVisibility(false);
    this.refreshUserProfileInfo();
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-color');
  }

  refreshUserProfileInfo() {
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      if (userInfo.responseMessage.responseCode < 6000) {
        // ERROR SCENARIO
        if (
          userInfo.objectList &&
          userInfo.objectList.length &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors[0].msg
          );
        } else if (userInfo.responseMessage && userInfo.responseMessage.responseDescription) {
          const errorResponse = userInfo.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      } else {
        this.signUpService.setUserProfileInfo(userInfo.objectList);
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  goToNext() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
  }
}
