import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { appConstants } from '../../app.constants';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { MyinfoModalComponent } from '../../shared/modal/myinfo-modal/myinfo-modal.component';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

import { LoaderService } from '../../shared/components/loader/loader.service';
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
    getComprehensiveEnquiry: any;
    maxDate: any;
    minDate: any;
    getComprehensiveData: any;
    saveData: string;
    getCurrentVersionType: any;
    fetchData: string;
    myInfoSubscription: any;
    myinfoChangeListener: Subscription;
    disabledAttributes: any;
    loader1Modal: any
    myinfoRetrievelDate: any;

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        this.redirectToDashboard();
    }

    public onCloseClick(): void {
        this.comprehensiveService.setProgressToolTipShown(true);
        this.showToolTip = false;
    }

    // tslint:disable-next-line: parameters-max-number
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
        private aboutAge: AboutAge,
        private myInfoService: MyInfoService,
        private modal: NgbModal
    ) {
        const today: Date = new Date();
        this.minDate = {
            year: today.getFullYear() - COMPREHENSIVE_CONST.YOUR_PROFILE.DATE_PICKER_MAX_YEAR,
            month: today.getMonth() + 1, day: today.getDate()
        };
        this.maxDate = {
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
                this.saveData = this.translate.instant('COMMON_LOADER.SAVE_DATA');
                this.fetchData = this.translate.instant('COMMON_LOADER.FETCH_DATA');
                this.loader1Modal = this.translate.instant(
                    'CMP.GETTING_STARTED.CFP_AUTOFILL.LOADER1'
                );
                this.setPageTitle(this.pageTitle);
            });
        });

        this.viewMode = this.comprehensiveService.getViewableMode();

        this.myinfoChangeListener = this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
            let attributeList = this.signUpService.corpBizMyInfoAttributes;
            if (this.disabledAttributes) {
                attributeList = this.removeMyInfoAttributes(this.disabledAttributes.cpfHousingFlag, COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.CPF_HOUSING_WITHDRAWAL, attributeList);
                attributeList = this.removeMyInfoAttributes(this.disabledAttributes.vehicleFlag, COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.VEHICLES, attributeList);
            }
            if (myinfoObj && myinfoObj !== '' && myinfoObj.status && myinfoObj.status === 'SUCCESS' &&
                (this.myInfoService.getMyInfoAttributes() === this.signUpService.corpBizMyInfoAttributes.join() ||
                    (this.disabledAttributes &&
                        (attributeList.join() === this.myInfoService.getMyInfoAttributes())
                    )
                )) {
                this.myInfoService.getMyInfoAccountCreateData().subscribe((data) => {
                    if (data.responseMessage.responseCode === 6000 && data && data['objectList'] && data['objectList'][0]) {
                        comprehensiveService.isCFPAutofillMyInfoEnabled = true;
                        signUpService.loadCorpBizUserMyInfoData(data['objectList'][0]);
                        this.myInfoService.isMyInfoEnabled = false;
                        this.closeMyInfoPopup();
                        comprehensiveApiService.getComprehensiveAutoFillCFPData().subscribe((compreData) => {
                            if (data && data.objectList[0]) {
                                this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
                                this.getComprehensiveEnquiry = this.comprehensiveService.getComprehensiveEnquiry();
                                this.getComprehensiveData = this.comprehensiveService.getComprehensiveEnquiry().type;
                                this.loaderService.hideLoaderForced();
                                router.navigate([COMPREHENSIVE_ROUTE_PATHS.CFP_AUTOFILL]);
                            }
                        }, err => {
                            this.loaderService.hideLoaderForced();
                        })
                    } else if (data.responseMessage.responseCode === 6014) {
                        this.closeMyInfoPopup();
                        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
                        ref.componentInstance.errorTitle = this.loader1Modal.title;
                        ref.componentInstance.errorMessageHTML = this.loader1Modal.message;
                        ref.componentInstance.primaryActionLabel = this.loader1Modal.btn;
                    } else {
                        this.closeMyInfoPopup();
                    }
                }, (error) => {
                    this.closeMyInfoPopup();
                });
            } else {
                this.myInfoService.isMyInfoEnabled = false;
                this.closeMyInfoPopup();
            }
        });
    }

    ngOnInit() {
        this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
        this.loaderService.showLoader({ title: this.fetchData, autoHide: false });
        this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
        this.comprehensiveApiService.getComprehensiveSummary().subscribe((data: any) => {
            if (data && data.objectList[0]) {
                this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
                this.getComprehensiveEnquiry = this.comprehensiveService.getComprehensiveEnquiry();
                this.getComprehensiveData = this.comprehensiveService.getComprehensiveEnquiry().type;
                if (this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.reportStatus
                    === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR || (!this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry
                        .isLocked && this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.reportStatus
                        === COMPREHENSIVE_CONST.REPORT_STATUS.READY)) {
                    this.loaderService.hideLoaderForced();
                    this.redirectToDashboard();
                }
                this.checkRedirect();
                this.loaderService.hideLoaderForced();
            }
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
                this.redirectToDashboard();
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
            this.loaderService.hideLoaderForced();
            this.router.navigate([redirectUrl]);
        } else {
            this.getUserProfileData();
            this.myinfoRetrievelDate = this.comprehensiveService.getMyinfoRetrievelDate();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.menuClickSubscription.unsubscribe();
        this.navbarService.unsubscribeBackPress();
        this.navbarService.unsubscribeMenuItemClick();
        if (this.myinfoChangeListener) {
            this.myinfoChangeListener.unsubscribe();
        }
    }

    setPageTitle(title: string) {
        this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
    }

    getUserProfileData() {
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.userDetails.gender = (this.userDetails.gender && (this.userDetails.gender.toLowerCase() === 'male' ||
            this.userDetails.gender.toLowerCase() === 'female')) ? this.userDetails.gender : '';
        this.disableDOB = this.getComprehensiveEnquiry.isDobUpdated;
        this.setUserProfileData();
        this.buildProfileForm();
        this.myProfileShow = true;
        this.comprehensiveService.setRiskQuestions().subscribe((data) => {
            this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
            this.progressService.updateValue(this.router.url, this.userDetails.firstName);
            this.progressService.refresh();
        });
        if (this.getComprehensiveEnquiry.isDobUpdated) {
            this.validateDOB(this.userDetails.ngbDob);
        }
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
                this.userDetails.enquiryId = this.comprehensiveService.getEnquiryId();
                if (!form.pristine) {
                    this.loaderService.showLoader({ title: this.saveData });
                    this.comprehensiveApiService.savePersonalDetails(this.userDetails).subscribe((data) => {
                        this.comprehensiveService.setMyProfile(this.userDetails);
                        if (this.comprehensiveService.getReportStatus() === null) {
                            const payload = { enquiryId: this.userDetails.enquiryId, reportStatus: COMPREHENSIVE_CONST.REPORT_STATUS.NEW };
                            this.comprehensiveApiService.updateComprehensiveReportStatus(payload).subscribe((reportRes: any) => {
                                if (reportRes) {
                                    this.comprehensiveApiService.getComprehensiveSummary().subscribe((resData: any) => {
                                        if (resData && resData.objectList[0]) {
                                            this.comprehensiveService.setComprehensiveSummary(resData.objectList[0]);
                                            this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.NEW);
                                            this.loaderService.hideLoader();
                                            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
                                        }
                                    });
                                }
                            });
                        } else {
                            this.comprehensiveApiService.getComprehensiveSummary().subscribe((resData: any) => {
                                if (resData && resData.objectList[0]) {
                                    this.comprehensiveService.setComprehensiveSummary(resData.objectList[0]);
                                    this.loaderService.hideLoader();
                                    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
                                }
                            });
                        }
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
        //COMPREHENSIVE_CONST.REPORT_STATUS.NEW
        if (this.comprehensiveService.getReportStatus() === null) {
            this.moGetStrdForm.markAsDirty();
        }
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
    redirectToDashboard() {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
    }

    /* RELEASE 10.4 MYINFO INTEGRATION */
    openDisclaimerModal() {
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'retrieve-myinfo-modal' });
        ref.componentInstance.errorTitle = this.translate.instant('CMP.GETTING_STARTED.CFP_AUTOFILL.DISCLAIMER_MODAL.TITLE');
        ref.componentInstance.primaryActionLabel = this.translate.instant('CMP.GETTING_STARTED.CFP_AUTOFILL.DISCLAIMER_MODAL.PROCEED_BTN');
        ref.componentInstance.primaryAction.subscribe(() => {
            this.openModal();
        });
    }
    openModal() {
        if (!this.viewMode) {
            const ref = this.modal.open(MyinfoModalComponent, { centered: true });
            ref.componentInstance.primaryActionLabel = `Let's go`;
            ref.componentInstance.myInfo = true;
            ref.componentInstance.myInfoEnableFlags.subscribe((attributesFlags: any) => {
                ref.result.then(() => {
                    this.disabledAttributes = attributesFlags
                    let attributes = COMPREHENSIVE_CONST.MY_INFO_ATTRIBUTES;
                    if (attributesFlags) {
                        attributes = this.removeMyInfoAttributes(attributesFlags.cpfHousingFlag, COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.CPF_HOUSING_WITHDRAWAL, attributes);
                        attributes = this.removeMyInfoAttributes(attributesFlags.vehicleFlag, COMPREHENSIVE_CONST.EXCLUDABLE_CORP_BIZ_MY_INFO_ATTRIBUTES.VEHICLES, attributes);
                    }
                    this.myInfoService.setMyInfoAttributes(attributes);
                    this.myInfoService.setMyInfoAppId(appConstants.MYINFO_CPF);
                    // this.myInfoService.goToMyInfo();
                    this.comprehensiveService.isCFPAutofillMyInfoEnabled = true; // TO BE REMOVED LATER
                    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.CFP_AUTOFILL]);
                }).catch((e) => {
                });
            });
        }
    }

    removeMyInfoAttributes(flag: any, attribute: any, attributes: any) {
        let attributeList = JSON.parse(JSON.stringify(attributes));
        if (!flag) {
            attributeList = attributeList.filter(attr => !attr.includes(attribute));
        }
        return attributeList;
    }

    cancelMyInfo() {
        this.myInfoService.isMyInfoEnabled = false;
        this.myInfoService.closeMyInfoPopup(false);
        if (this.myInfoSubscription) {
            this.myInfoSubscription.unsubscribe();
        }
    }
    closeMyInfoPopup() {
        this.myInfoService.closeFetchPopup();
        this.myInfoService.changeListener.next('');
        if (this.myInfoService.isMyInfoEnabled) {
            this.myInfoService.isMyInfoEnabled = false;
            const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'my-info' });
            ref.componentInstance.errorTitle = this.translate.instant('MYINFO.ERROR_MODAL_DATA.TITLE');
            ref.componentInstance.errorMessage = this.translate.instant('MYINFO.ERROR_MODAL_DATA.DESCRIPTION');
            ref.componentInstance.isMyinfoError = true;
            ref.componentInstance.closeBtn = false;
            ref.result.then(() => {
                this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
            }).catch((e) => {
            });
        }
    }

    // NRIC used error modal
    openNricErrorModal() {
        if (!this.viewMode) {
            const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'nric-used-modal' });
            ref.componentInstance.errorTitle = this.translate.instant('MYINFO.NRIC_USED_ERROR.TITLE');
            ref.componentInstance.errorMessageHTML = this.translate.instant('MYINFO.NRIC_USED_ERROR.DESCRIPTION');
            ref.componentInstance.primaryActionLabel = this.translate.instant('MYINFO.NRIC_USED_ERROR.BTN-TEXT');
            ref.componentInstance.closeAction.subscribe(() => {
                this.modal.dismissAll();
            });
            ref.result.then((data) => {
                this.modal.dismissAll();
            }).catch((e) => {
            });
        }
    }
}
