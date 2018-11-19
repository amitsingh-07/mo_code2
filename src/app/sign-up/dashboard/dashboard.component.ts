import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { IEnquiryUpdate } from '../signup-types';
import { AppService } from './../../app.service';
import { PORTFOLIO_ROUTE_PATHS } from './../../portfolio/portfolio-routes.constants';
import { ApiService } from './../../shared/http/api.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SelectedPlansService } from './../../shared/Services/selected-plans.service';
import { Formatter } from './../../shared/utils/formatter.util';
import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userProfileInfo: any;
  insuranceEnquiry: any;

  constructor(
    private router: Router,
    public readonly translate: TranslateService, private appService: AppService,
    private signUpService: SignUpService, private apiService: ApiService,
    public navbarService: NavbarService, private selectedPlansService: SelectedPlansService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(3);
    this.navbarService.setNavbarMobileVisibility(true);
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.translate.use('en');

    this.insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
    if (this.insuranceEnquiry && this.insuranceEnquiry.plans && this.insuranceEnquiry.plans.length > 0) {
      const payload: IEnquiryUpdate = {
        customerId: this.appService.getCustomerId(),
        enquiryId: Formatter.getIntValue(this.insuranceEnquiry.enquiryId),
        selectedProducts: this.insuranceEnquiry.plans
      };
      this.apiService.updateInsuranceEnquiry(payload).subscribe((data) => {
        this.selectedPlansService.clearData();
      });
    }
  }

  goToEngagement() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }

  goToEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }

}
