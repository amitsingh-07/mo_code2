import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { HeaderService } from '../../shared/header/header.service';
import { SignUpService } from '../sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageProfileComponent implements OnInit {
  pageTitle: any;
  entireUserData: any;
  personalData: any;
  empolymentDetails: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private translate: TranslateService,
    private signUpService: SignUpService,
    private router: Router,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('EDIT_PROFILE.MANAGE_PROFILE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(102);
    this.footerService.setFooterVisibility(false);
    this.setPageTitle(this.pageTitle);
    this.getEditProfileData();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getEditProfileData() {
    this.showLoader();
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        this.entireUserData = data.objectList;
        if (data.objectList) {
          if (data.objectList.personalInformation) {
            this.personalData = data.objectList.personalInformation;
          }
          this.empolymentDetails = null;
        }
      }
    }, (err) => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  editMobileDetails() {
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_USER_DETAILS + '/mobile']);
  }

  editEmailDetails() {
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_USER_DETAILS + '/email']);
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }

}
