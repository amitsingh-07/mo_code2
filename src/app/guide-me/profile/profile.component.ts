import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAnalyticsService } from '../../shared/ga/google-analytics.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LoggerService } from '../../shared/logger/logger.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { ProductDetailComponent } from './../../shared/components/product-detail/product-detail.component';

const assetImgPath = './assets/images/';

const profileHelpImages = {
  helpImg_1: 'profile-single-professional.png',
  helpImg_2: 'profile-married-with-no-kids.png',
  helpImg_3: 'profile-parent.png',
  helpImg_4: 'profile-student.png',
  helpImg_5: 'profile-retiree.png',
  helpImg_6: 'profile-homemaker.png',
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
    private modal: NgbModal, public headerService: HeaderService,
    public readonly translate: TranslateService, public authService: AuthenticationService,
    public log: LoggerService, private guideMeApiService: GuideMeApiService, private googleAnalytics: GoogleAnalyticsService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.profileFormValues = this.guideMeService.getGuideMeFormData();
    this.profileForm = new FormGroup({
      myProfile: new FormControl(this.profileFormValues.myProfile, Validators.required)
    });
    this.authService.authenticate().subscribe((token) => {
      this.guideMeApiService.getProfileList().subscribe((data) => this.profileList = data.objectList);
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
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

  viewDetails() {
    const plan = {
      "id": "0",
      "riderId": 0,
      "productName": "MyProtector Term Plan",
      "purposeId": 1,
      "objectiveId": 2,
      "typeId": 1,
      "searchCount": 0,
      "whyBuy": "I am concerned my family cannot cope financially with the loss of income upon my demise.",
      "payOut": "A lump sum benefit upon death or terminal illness (TI).",
      "underWritting": "Yes",
      "rebate": "Eligible",
      "cashValue": "No",
      "cashPayoutFrequency": "",
      "coverageDuration": "At least 5 years, to age 99 (max)",
      "premiumDuration": "Throughout policy duration",
      "features": "Convertible to Whole Life or Endowment. ~Option to increase cover at key life stages. ~Guaranteed renewable option for 5-yr or 10-yr Term. ~Unique riders like Enhanced CI (36 definitions) available.~Multi-currency available.",
      "productDescription": "This Term policy provides high protection at low cost with death and TI benefits. If 5 -year or 10-year Term is chosen, it can renew for another 5/10 years at the end of the Term duration. Six currency options are available: SGD, EUR. USD, GBP,  AUD and HKD. You can also attached optional riders like TPD to enhance its benefits. ",
      "status": "Active",
      "brochureLink": "0",
      "isAuthorised": true,
      "lastUpdated": "2018-08-28T08:51:17.000+0000",
      "lastUpdatedBy": "0",
      "insurer": {
        "id": "AVV",
        "insurerName": "Aviva",
        "logoName": "logo-aviva.png",
        "url": "https://www.aviva.com.sg",
        "lastUpdatedTime": "2017-05-03T07:24:46.000+0000",
        "rating": "",
        "lastUpdatedBy": "0"
      },
      "premium": {
        "id": "P104",
        "gender": "Male",
        "minimumAge": 21,
        "coverageName": "$500,000",
        "durationName": "till age 65",
        "premiumTerm": "",
        "savingsDuration": "",
        "retirementPayourAmount": "",
        "retirementPayourDuration": "",
        "premiumAmount": "455",
        "premiumFrequency": "per year",
        "intrestRateOfReturn": "0.00",
        "ranking": 2,
        "lastUpdatedDate": "2017-02-21T18:30:00.000+0000",
        "lastUpdatedBy": "0"
      },
      "promotion": {
        "insurerId": "AVV",
        "thumbnail": "avv_myprotector.jpg",
        "promoDiscount": "*5% OFF",
        "promoTitle": "Enjoy a 5% perpetual premium discount for Aviva MyProtector Term Plan (Extended)",
        "description": "Pay Lesser to Enjoy the Same Protection with Aviva MyProtector Term Plan (Extended)",
        "link": "32.jsp",
        "expired": "FALSE",
        "expiredDate": "2018-03-31T15:59:00.000+0000",
        "lastUpdatedTime": "2018-01-03T04:04:01.000+0000",
        "lastUpdatedBy": "0"
      },
      "authorised": true,
      isBestValue: true
    };
    const ref = this.modal.open(ProductDetailComponent, { centered: true });
    ref.componentInstance.plan = plan;
    ref.componentInstance.protectionType = 'life protection';
    ref.result.then((data) => {
      if (data) {
        console.log('selected plan from modal');
        console.log(data);
      }
    }).catch((e) => {
      console.log(e);
    });
  }
}
