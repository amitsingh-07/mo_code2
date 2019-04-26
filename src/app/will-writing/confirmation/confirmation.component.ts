import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WillWritingFormData } from '../will-writing-form-data';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IBeneficiary } from '../will-writing-types';
import { WillWritingApiService } from '../will-writing.api.service';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';
import {AuthenticationService} from '../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  pageTitle: string;
  step: string;
  duplicateError: string;
  existingWill: boolean;

  willWritingFormData: WillWritingFormData = new WillWritingFormData();
  willWritingRoutePaths = WILL_WRITING_ROUTE_PATHS;
  willWritingConfig = WILL_WRITING_CONFIG;
  willEstateDistribution = { spouse: [], children: [], others: [] };
  willBeneficiary: IBeneficiary[];
  createWillTriggered = false;

  constructor(
    private translate: TranslateService,
    private willWritingService: WillWritingService,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private willWritingApiService: WillWritingApiService,
    private router: Router,
    private authService: AuthenticationService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_4');
      this.pageTitle = this.translate.instant('WILL_WRITING.CONFIRMATION.TITLE');
      this.duplicateError = this.translate.instant('WILL_WRITING.CONFIRMATION.DUPLICATE_ERROR');
      this.setPageTitle(this.pageTitle);
    });

    this.existingWill = this.willWritingService.getIsWillCreated();
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.willWritingService.setFromConfirmPage(false);
    this.willWritingFormData = this.willWritingService.getWillWritingFormData();
    const estateDistribution = this.willWritingFormData.beneficiary.filter((beneficiary) => beneficiary.selected === true);
    this.willBeneficiary = estateDistribution;
    for (const beneficiary of estateDistribution) {
      if (beneficiary.relationship === WILL_WRITING_CONFIG.SPOUSE) {
        this.willEstateDistribution.spouse.push(beneficiary);
      } else if (beneficiary.relationship === WILL_WRITING_CONFIG.CHILD) {
        this.willEstateDistribution.children.push(beneficiary);
      } else {
        this.willEstateDistribution.others.push(beneficiary);
      }
    }
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
  }

  edit(url) {
    this.willWritingService.setFromConfirmPage(true);
    this.router.navigate([url]);
  }

  goNext() {
    if (!this.createWillTriggered && this.willWritingService.checkDuplicateUinAll()) {
      this.createWillTriggered = true;
      if (this.authService.isSignedUser()) {
        let createUpdateWill;
        if (!this.willWritingService.getIsWillCreated()) {
          createUpdateWill = this.willWritingApiService.createWill();
        } else {
          createUpdateWill = this.willWritingApiService.updateWill();
        }
        createUpdateWill.subscribe((data) => {
          this.createWillTriggered = false;
          if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
            this.willWritingService.setIsWillCreated(true);
            this.router.navigate([WILL_WRITING_ROUTE_PATHS.VALIDATE_YOUR_WILL]);
          } else if (data.responseMessage && data.responseMessage.responseCode === 5006) {
            this.willWritingService.openToolTipModal('', this.duplicateError);
          }
        });
      } else {
        this.willWritingApiService.createWill().subscribe((data) => {
          this.createWillTriggered = false;
          if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
            this.willWritingService.setWillCreatedPrelogin();
            this.router.navigate([WILL_WRITING_ROUTE_PATHS.SIGN_UP]);
          } else if (data.responseMessage && data.responseMessage.responseCode === 5006) {
            this.willWritingService.openToolTipModal('', this.duplicateError);
          }
        });
      }
    }
  }

}
