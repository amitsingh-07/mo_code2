import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SignUpService } from '../sign-up.service';

// Will Writing
import { WillWritingApiService } from 'src/app/will-writing/will-writing.api.service';
import { WillWritingService } from 'src/app/will-writing/will-writing.service';
import { WILL_WRITING_ROUTE_PATHS } from '../../will-writing/will-writing-routes.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  userProfileInfo: any;

  // Will Writing
  showWillWritingSection = false;
  wills: any = {};

  constructor(
    private router: Router,
    private signUpApiService: SignUpApiService,
    public readonly translate: TranslateService,
    private signUpService: SignUpService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    // #Will Writing

    private willWritingApiService: WillWritingApiService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(false);

    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      this.signUpService.setUserProfileInfo(userInfo.objectList);
      this.userProfileInfo = this.signUpService.getUserProfileInfo();
    });

    this.willWritingApiService.getWill().subscribe((data) => {
      this.showWillWritingSection = true;
      if (data.responseMessage && data.responseMessage.responseCode === 6000) {
        this.wills.hasWill = true;
        this.wills.completedWill = data.objectList[0].willProfile.hasWill === 'Y';
        this.wills.lastUpdated = data.objectList[0].willProfile.profileLastUpdatedDate;
        if (!this.willWritingService.getIsWillCreated()) {
          this.willWritingService.convertWillFormData(data.objectList[0]);
          this.willWritingService.setIsWillCreated(true);
        }
      } else if (data.responseMessage && data.responseMessage.responseCode === 6004) {
        this.wills.hasWill = false;
      }
    });
  }

  redirectTo(page: string) {
    if (page === 'edit') {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.CONFIRMATION]);
    } else {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.INTRODUCTION]);
    }
  }

  downloadWill() {
    this.willWritingApiService.downloadWill().subscribe((data: any) => {
    }, (error) => console.log(error));
  }

}
