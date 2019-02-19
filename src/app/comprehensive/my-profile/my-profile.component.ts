import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { ImyProfile } from '../comprehensive-types';

import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class MyProfileComponent implements IPageComponent, OnInit {
  nationDisabled: boolean;
  DobDisabled: boolean;
  DobBoolean: any;
  registeredUser = true;
  pageTitle: string;
  userDetails: ImyProfile;
  moGetStrdForm: FormGroup;
  nationality = '';
  nationalityList: string;
  submitted: boolean;
  nationalityAlert = false;
  pageId: string;
  genderDisabled = false;
  myProfileShow = true;
  DOBAlert = false;

  public showToolTip = false;

  public onCloseClick(): void {
    this.showToolTip = false;
  }

  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private configDate: NgbDatepickerConfig, private comprehensiveService: ComprehensiveService,
    private parserFormatter: NgbDateParserFormatter, private comprehensiveApiService: ComprehensiveApiService) {
    const today: Date = new Date();
    configDate.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.outsideDays = 'collapsed';
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

    this.pageId = this.route.routeConfig.component.name;
    this.comprehensiveApiService.getPersonalDetails().subscribe((data: any) => {
      this.userDetails = data.objectList[0];
      this.nationality = this.userDetails.nation ? this.userDetails.nation : '';
      const dob = this.userDetails.dateOfBirth ? this.userDetails.dateOfBirth.split('/') : '';
      this.userDetails.gender = this.userDetails.gender ? this.userDetails.gender : '';
      this.userDetails.dateOfBirth = {
        // tslint:disable-next-line:radix
        year: parseInt(dob[0]), month: parseInt(dob[1]), day: parseInt(dob[2
        ])
      };
      this.buildMoGetStrdForm(this.userDetails);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMoGetStrdForm(this.userDetails);
    setTimeout(() => {
      this.showToolTip = true;
    }, 1000);

  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  get myProfileControls() { return this.moGetStrdForm.controls; }

  buildMoGetStrdForm(userDetails) {
    this.moGetStrdForm = this.formBuilder.group({
      firstName: [userDetails ? userDetails.firstName : ''],
      gender: [userDetails ? userDetails.gender : '', [Validators.required]],
      nation: [userDetails ? userDetails.nation : '', [Validators.required]],
      dateOfBirth: [userDetails ? userDetails.dateOfBirth : '', [Validators.required]],

    });
    this.myProfileShow = false;
  }

  goToNext(form: FormGroup) {
    if (this.validateMoGetStrdForm(form)) {
      this.comprehensiveApiService.savePersonalDetails(form.value).subscribe((data) => {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
      });
    }

  }
  selectNationality(nationality: any) {
    this.nationalityAlert = true;
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

    form.value.dateOfBirth = this.parserFormatter.format(form.value.dateOfBirth);
   

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
