import { Subscription } from 'rxjs';

import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { FooterService } from '../../shared/footer/footer.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IAboutMe } from '../will-writing-types';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit, OnDestroy {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  pageTitle: string;
  step: string;
  private confirmModal = {};

  aboutMeForm: FormGroup;
  formValues: IAboutMe;
  maritalStatus = '';
  noOfChildren = '';
  maritalStatusList;
  noOfChildrenList: number[] = Array(WILL_WRITING_CONFIG.MAX_CHILDREN_COUNT).fill(0).map((x, i) => x += i * 1);
  submitted: boolean;
  private subscription: Subscription;
  unsavedMsg: string;
  toolTip;

  fromConfirmationPage = this.willWritingService.fromConfirmationPage;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    public footerService: FooterService,
    private modal: NgbModal, public navbarService: NavbarService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_1');
      this.pageTitle = this.translate.instant('WILL_WRITING.ABOUT_ME.TITLE');
      this.maritalStatusList = this.translate.instant('WILL_WRITING.ABOUT_ME.FORM.MARITAL_STATUS_LIST');
      this.confirmModal['hasNoImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM');
      this.confirmModal['hasImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM_IMPACT_MESSAGE');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.toolTip = this.translate.instant('WILL_WRITING.COMMON.ID_TOOLTIP');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.buildAboutMeForm();
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_WILL_WRITING);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.aboutMeForm.dirty) {
          this.pageTitleComponent.goBack();
        } else {
          this._location.back();
        }
        return false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
  }

  /**
   * build about me form.
   */
  buildAboutMeForm() {
    this.formValues = this.willWritingService.getAboutMeInfo();
    this.aboutMeForm = this.formBuilder.group({
      name: [this.formValues.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100),
      Validators.pattern(RegexConstants.NameWithSymbol)]],
      uin: [this.formValues.uin, [Validators.required]],
      gender: [this.formValues.gender, [Validators.required]],
      maritalStatus: [this.formValues.maritalStatus, [Validators.required]],
      noOfChildren: [this.formValues.noOfChildren, [Validators.required]]
    });
    setTimeout(() => {
      if (this.formValues.maritalStatus !== undefined) {
        const index = this.maritalStatusList.findIndex((status) => status.value === this.formValues.maritalStatus);
        this.selectMaritalStatus(this.maritalStatusList[index], '');
      }
      if (this.formValues.noOfChildren !== undefined) {
        this.selectNoOfChildren(this.formValues.noOfChildren, '');
      }
    }, 100);
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  validateAboutMeForm(form: any) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'aboutMeForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false, 'About Me');
      return false;
    }
    return true;
  }

  get abtMe() { return this.aboutMeForm.controls; }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectMaritalStatus(status, from) {
    status = status ? status : { text: '', value: '' };
    this.maritalStatus = status.text;
    this.aboutMeForm.controls['maritalStatus'].setValue(status.value);
    if (from) {
      this.aboutMeForm.markAsDirty();
    }
  }

  /**
   * set no of childrens.
   * @param children - no of children count.
   */
  selectNoOfChildren(children: any, from) {
    this.noOfChildren = children;
    this.aboutMeForm.controls['noOfChildren'].setValue(this.noOfChildren);
    if (from) {
      this.aboutMeForm.markAsDirty();
    }
  }

  openToolTipModal() {
    this.willWritingService.openToolTipModal(this.toolTip.TITLE, this.toolTip.MESSAGE);
  }

  openConfirmationModal(url: string, hasImpact: boolean, form: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.unSaved = true;
    ref.componentInstance.hasImpact = this.confirmModal['hasNoImpact'];
    if (hasImpact) {
      ref.componentInstance.hasImpact = this.confirmModal['hasImpact'];
    }
    ref.result.then((data) => {
      if (data === 'yes') {
        this.willWritingService.setFromConfirmPage(false);
        this.save(form, url);
      }
    });
    return false;
  }

  save(form, url) {
    this.willWritingService.setAboutMeInfo(form.value);
    this.router.navigate([url]);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.validateAboutMeForm(form)) {
      let url = (form.value.maritalStatus !== WILL_WRITING_CONFIG.MARRIED && form.value.noOfChildren === 0) ?
        WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE : WILL_WRITING_ROUTE_PATHS.MY_FAMILY;
      if (Object.keys(this.formValues).length === 0 && this.formValues.constructor === Object) {
        this.save(form, url);
      } else {
        if (this.aboutMeForm.dirty) {
          let isUserLogged = false;
          let isChildChanged;
          let isMaritalStatusChanged;
          if (this.formValues.noOfChildren !== form.value.noOfChildren) {
            isUserLogged = this.willWritingService.getIsWillCreated();
            isChildChanged = true;
          }
          if (this.formValues.maritalStatus !== form.value.maritalStatus) {
            if (this.formValues.maritalStatus === WILL_WRITING_CONFIG.MARRIED || form.value.maritalStatus === WILL_WRITING_CONFIG.MARRIED) {
              isUserLogged = this.willWritingService.getIsWillCreated();
              isMaritalStatusChanged = true;
            }
          }
          if (!isChildChanged && !isMaritalStatusChanged) {
            url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : url;
          }
          this.openConfirmationModal(url, isUserLogged, form);
        } else {
          url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : url;
          this.router.navigate([url]);
        }
      }
    }
  }
}
