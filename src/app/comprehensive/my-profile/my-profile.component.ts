import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


import { LoaderService } from '../../shared/components/loader/loader.service';
import { ApiService } from '../../shared/http/api.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { SignUpService } from '../../sign-up/sign-up.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { AboutAge } from './../../shared/utils/about-age.util';
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
    submitted = false;
    nationalityAlert = false;
    pageId: string;
    genderDisabled = false;
    myProfileShow = false;
    DOBAlert = false;
    viewMode: boolean;
    menuClickSubscription: Subscription;
    subscription: Subscription;
    disableDOB = false;
    public showToolTip = false;

    public onCloseClick(): void {
        this.comprehensiveService.setProgressToolTipShown(true);
        this.showToolTip = false;
    }

    constructor(
        private loaderService: LoaderService,
        private signUpService: SignUpService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public navbarService: NavbarService,
        private translate: TranslateService,
        private formBuilder: FormBuilder,
        private configService: ConfigService,
        private configDate: NgbDatepickerConfig,
        private comprehensiveService: ComprehensiveService,
        private parserFormatter: NgbDateParserFormatter,
        private comprehensiveApiService: ComprehensiveApiService,
        private progressService: ProgressTrackerService,
        private aboutAge: AboutAge
    ) {
        const today: Date = new Date();
        configDate.minDate = {
            year: today.getFullYear() - COMPREHENSIVE_CONST.YOUR_PROFILE.DATE_PICKER_MAX_YEAR,
            month: today.getMonth() + 1, day: today.getDate()
        };
        configDate.maxDate = {
            year: today.getFullYear() - COMPREHENSIVE_CONST.YOUR_PROFILE.DATE_PICKER_MIN_YEAR,
            month: today.getMonth() + 1, day: today.getDate()
        };
        configDate.outsideDays = 'collapsed';
        this.pageId = this.activatedRoute.routeConfig.component.name;
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

        this.viewMode = this.comprehensiveService.getViewableMode();

    }

    ngOnInit() {
        this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
        this.loaderService.showLoader({ title: 'Fetching Data' });
        this.comprehensiveApiService.getComprehensiveSummary().subscribe((data: any) => {
            this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
            if (this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {

            }
            this.loaderService.hideLoader();
            this.checkRedirect();
        });

        this.navbarService.setNavbarComprehensive(true);
        this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
            if (this.pageId === pageId) {
                this.onCloseClick();
                this.progressService.show();
            }
        });

        this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
            if (event && event !== '') {
                const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
                if (previousUrl !== null) {
                    this.router.navigate([previousUrl]);
                } else {
                    this.navbarService.goBack();
                }
            }
        });

        if (!this.comprehensiveService.isProgressToolTipShown()) {
            setTimeout(() => {
                this.showToolTip = true;
            }, 1000);
        }
    }
    checkRedirect() {
        const redirectUrl = this.signUpService.getRedirectUrl();
        if (redirectUrl) {
            this.signUpService.clearRedirectUrl();
            this.loaderService.hideLoader();
            this.router.navigate([redirectUrl]);
        } else {
            this.getUserProfileData();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.menuClickSubscription.unsubscribe();
        this.navbarService.unsubscribeBackPress();
        this.navbarService.unsubscribeMenuItemClick();
    }

    setPageTitle(title: string) {
        this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
    }

    getUserProfileData() {
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.disableDOB = !this.userDetails.dobUpdateable;
        this.setUserProfileData();
        this.buildProfileForm();
        this.myProfileShow = true;
        this.progressService.updateValue(this.router.url, this.userDetails.firstName);
        this.progressService.refresh();
    }

    setUserProfileData() {
        this.nationality = this.userDetails.nationalityStatus ? this.userDetails.nationalityStatus : '';
        this.userDetails.ngbDob = this.parserFormatter.parse(this.userDetails.dateOfBirth);
    }

    get myProfileControls() {
        return this.moGetStrdForm.controls;
    }

    buildProfileForm() {
        this.moGetStrdForm = this.formBuilder.group({
            firstName: [this.userDetails ? this.userDetails.firstName : ''],
            gender: [this.userDetails && this.userDetails.gender ? this.userDetails.gender.toLocaleLowerCase() : '', [Validators.required]],
            nationalityStatus: [this.userDetails ? this.userDetails.nationalityStatus : '', [Validators.required]],
            dateOfBirth: [this.userDetails ? this.userDetails.dateOfBirth : ''],
            ngbDob: [this.userDetails ? this.userDetails.ngbDob : '', [Validators.required]]
        });
        this.myProfileShow = false;
    }

    goToNext(form: FormGroup) {
        if (this.viewMode) {
            this.comprehensiveService.setProgressToolTipShown(true);
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
        } else {
            if (this.validateMoGetStrdForm(form) && !this.validateDOB(form.value.ngbDob)) {
                this.userDetails = form.getRawValue();
                this.userDetails.dateOfBirth = this.parserFormatter.format(form.getRawValue().ngbDob);
                if (!form.pristine) {
                    this.comprehensiveApiService.savePersonalDetails(this.userDetails).subscribe((data) => {
                        this.comprehensiveService.setMyProfile(this.userDetails);
                        const cmpSummary = this.comprehensiveService.getComprehensiveSummary();
                        cmpSummary.comprehensiveEnquiry.hasComprehensive = true;
                        cmpSummary.baseProfile = this.comprehensiveService.getMyProfile();
                        this.comprehensiveService.setComprehensiveSummary(cmpSummary);
                        this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.NEW);
                        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
                    });
                } else {
                    this.comprehensiveService.setProgressToolTipShown(true);
                    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
                }
            }
        }
    }
    selectNationality(nationality: any) {
        nationality = nationality ? nationality : { text: '', value: '' };
        this.nationality = nationality.text;
        this.moGetStrdForm.controls['nationalityStatus'].setValue(nationality.text);
        this.moGetStrdForm.markAsDirty();
    }
    validateDOB(date) {
        const today: Date = new Date();
        const inputDateFormat = this.parserFormatter.format(date);
        const getAge = this.aboutAge.calculateAge(inputDateFormat, today);
        if (getAge > COMPREHENSIVE_CONST.YOUR_PROFILE.APP_MAX_AGE || getAge < COMPREHENSIVE_CONST.YOUR_PROFILE.APP_MIN_AGE) {
            this.DOBAlert = true;
        } else {
            this.DOBAlert = false;
        }
        return this.DOBAlert;
    }

    validateMoGetStrdForm(form: FormGroup) {
        this.submitted = true;
        if (!form.valid) {
            Object.keys(form.controls).forEach((key) => {
                form.get(key).markAsDirty();
            });

            const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_PROFILE);
            this.comprehensiveService.openErrorModal(
                error.title,
                error.errorMessages,
                false,
                this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_PROFILE')
            );
            return false;
        }
        return true;
    }
}
