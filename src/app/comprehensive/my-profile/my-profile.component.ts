import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';

import { LoaderService } from '../../shared/components/loader/loader.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-cmp-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements IPageComponent, OnInit, OnDestroy {
  nationDisabled: boolean;
  DobDisabled: boolean;
  DobBoolean: any;
  registeredUser = true;
  pageTitle: string;
  userDetails: IMyProfile;
  moGetStrdForm: FormGroup;
  nationality = '';
  nationalityList: string;
  submitted: boolean;
  nationalityAlert = false;
  pageId: string;
  genderDisabled = false;
  myProfileShow = true;
  DOBAlert = false;

  menuClickSubscription: Subscription;
  public showToolTip = false;

  public onCloseClick(): void {
    this.comprehensiveService.setProgressToolTipShown(true);
    this.showToolTip = false;
  }

  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private configDate: NgbDatepickerConfig, private comprehensiveService: ComprehensiveService,
    private parserFormatter: NgbDateParserFormatter, private comprehensiveApiService: ComprehensiveApiService) {
    const today: Date = new Date();
    configDate.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.outsideDays = 'collapsed';
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.GETTING_STARTED.TITLE');
        this.nationalityList = this.translate.instant('CMP.NATIONALITY');
        this.setPageTitle(this.pageTitle);
      });
    });

    this.userDetails = this.comprehensiveService.getMyProfile();
    if (!this.userDetails.dateOfBirth) {
      this.loaderService.showLoader({ title: 'Fetching Data' });
      this.comprehensiveApiService.getPersonalDetails().subscribe((data: any) => {
        this.loaderService.hideLoader();
        this.userDetails = data.objectList[0];
      });
    } else {
      this.setUserProfileData();
    }
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Get Started Menu Clicked');
      }
    });
    this.buildProfileForm();
    if (!this.comprehensiveService.isProgressToolTipShown()) {
      setTimeout(() => {
        this.showToolTip = true;
      }, 1000);
    }

  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  setUserProfileData() {
    this.nationality = this.userDetails.nation ? this.userDetails.nation : '';
  }

  get myProfileControls() { return this.moGetStrdForm.controls; }

  buildProfileForm() {
    this.moGetStrdForm = this.formBuilder.group({
      firstName: [this.userDetails ? this.userDetails.firstName : ''],
      gender: [this.userDetails ? this.userDetails.gender : '', [Validators.required]],
      nation: [this.userDetails ? this.userDetails.nation : '', [Validators.required]],
      dateOfBirth: [this.userDetails ? this.userDetails.dateOfBirth : ''],
      ngbDob: [this.userDetails ? this.userDetails.ngbDob : '', [Validators.required]]

    });
    this.myProfileShow = false;
  }

  goToNext(form: FormGroup) {
    if (this.validateMoGetStrdForm(form)) {
      form.value.dateOfBirth = this.parserFormatter.format(form.value.ngbDob);
      form.value.firstName = this.userDetails.firstName;
      this.comprehensiveService.setMyProfile(form.value);
      this.comprehensiveService.setProgressToolTipShown(true);
      this.comprehensiveApiService.savePersonalDetails(form.value).subscribe((data) => {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
      });
    }

  }
  selectNationality(nationality: any) {
    if (this.nationality) {
      this.nationalityAlert = true;
    }
    nationality = nationality ? nationality : { text: '', value: '' };
    this.nationality = nationality.text;
    this.moGetStrdForm.controls['nation'].setValue(nationality.value);
    this.moGetStrdForm.markAsDirty();
  }
  validateDOB(date) {
    const today: Date = new Date();
    if ((today.getFullYear() - date._model.year) > 55) {
      this.DOBAlert = true;
    } else {
      this.DOBAlert = false;
    }

  }

  validateMoGetStrdForm(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_PROFILE);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_PROFILE'));
      return false;
    }
    return true;
  }
}
