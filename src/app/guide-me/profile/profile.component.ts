import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAnalyticsService } from '../../shared/analytics/google-analytics.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../shared/logger/logger.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SeoServiceService } from './../../shared/Services/seo-service.service';

const assetImgPath = './assets/images/';

const profileHelpImages = {
  helpImg_1: 'single-professional.svg',
  helpImg_2: 'married-with-no-kids.svg',
  helpImg_3: 'iamparent.svg',
  helpImg_4: 'iamstudent.svg',
  helpImg_5: 'iamretiree.svg',
  helpImg_6: 'homemaker.svg',
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements IPageComponent, OnInit {

  pageTitle: string;
  profileForm: FormGroup;
  profileList: any[];
  helpImg: any[];
  profileFormValues: any;
  modalRef: NgbModalRef;

  constructor(
    private guideMeService: GuideMeService, private router: Router,
    private modal: NgbModal, public headerService: HeaderService, public navbarService: NavbarService, public footerService: FooterService,
    public readonly translate: TranslateService, public authService: AuthenticationService,
    public log: LoggerService, private guideMeApiService: GuideMeApiService, private googleAnalytics: GoogleAnalyticsService,
    private appService: AppService, private seoService: SeoServiceService) {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_GUIDED);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle);
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('PROFILE.META.META_TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('PROFILE.META.META_TITLE'),
        this.translate.instant('PROFILE.META.META_DESCRIPTION'),
        this.translate.instant('PROFILE.META.META_KEYWORDS'));
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.profileFormValues = this.guideMeService.getGuideMeFormData();
    this.profileForm = new FormGroup({
      myProfile: new FormControl(this.profileFormValues.myProfile, Validators.required)
    });
    if (this.authService.isAuthenticated()) {
      this.getProfileList();
    } else {
      this.authService.authenticate().subscribe((token) => {
        this.getProfileList();
      });
    }
    this.footerService.setFooterVisibility(false);
  }

  getProfileList() {
    this.guideMeApiService.getProfileList().subscribe((data) => this.profileList = data.objectList);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showHelpModal(id) {
    this.modalRef = this.modal.open(HelpModalComponent, { centered: true, windowClass: 'help-modal-dialog' });

    this.modalRef.componentInstance.description = this.profileList[id].description;
    this.modalRef.componentInstance.title = this.profileList[id].name;
    this.modalRef.componentInstance.img = assetImgPath + profileHelpImages['helpImg_' + (id + 1)];

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.modalRef.close();
      }
    });
  }

  save(form): boolean {
    if (!form.valid) {
      return false;
    }
    this.guideMeService.setProfile(this.profileForm.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.googleAnalytics.startTime('guideMe');
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.GET_STARTED]);
    }
  }
}
