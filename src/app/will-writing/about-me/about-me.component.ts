import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
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
  pageTitle: string;
  step: string;

  aboutMeForm: FormGroup;
  formValues: IAboutMe;
  maritalStatus = '';
  noOfChildren = '';
  maritalStatusList;
  noOfChildrenList: number[] = Array(WILL_WRITING_CONFIG.MAX_CHILDREN_COUNT).fill(0).map((x, i) => x += i * 1);
  submitted: boolean;
  private subscription: Subscription;
  unsavedMsg: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private modal: NgbModal, public navbarService: NavbarService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_1');
      this.pageTitle = this.translate.instant('WILL_WRITING.ABOUT_ME.TITLE');
      this.maritalStatusList = this.translate.instant('WILL_WRITING.ABOUT_ME.FORM.MARITAL_STATUS_LIST');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.buildAboutMeForm();
    this.headerSubscription();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.aboutMeForm.dirty) {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.unsavedMsg;
          ref.componentInstance.unSaved = true;
          ref.result.then((data) => {
            if (data === 'yes') {
              this._location.back();
            }
          });
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
      name: [this.formValues.name, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      uin: [this.formValues.uin, [Validators.required, Validators.pattern(RegexConstants.UIN)]],
      gender: [this.formValues.gender, [Validators.required]],
      maritalStatus: [this.formValues.maritalStatus, [Validators.required]],
      noOfChildren: [this.formValues.noOfChildren, [Validators.required]]
    });
    setTimeout(() => {
      if (this.formValues.maritalStatus !== undefined) {
        const index = this.maritalStatusList.findIndex((status) => status.value === this.formValues.maritalStatus);
        this.selectMaritalStatus(this.maritalStatusList[index]);
      }
      if (this.formValues.noOfChildren !== undefined) {
        this.selectNoOfChildren(this.formValues.noOfChildren);
      }
    }, 100);
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'aboutMeForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false);
    } else {
      this.willWritingService.setAboutMeInfo(form.value);
      return true;
    }
  }

  get abtMe() { return this.aboutMeForm.controls; }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectMaritalStatus(status) {
    status = status ? status : {text: '', value: ''};
    this.maritalStatus = status.text;
    this.aboutMeForm.controls['maritalStatus'].setValue(status.value);
  }

  /**
   * set no of childrens.
   * @param children - no of children count.
   */
  selectNoOfChildren(children: any) {
    this.noOfChildren = children;
    this.aboutMeForm.controls['noOfChildren'].setValue(this.noOfChildren);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      if (form.value.maritalStatus === 'single' && form.value.noOfChildren === 0) {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
      }
    }
  }

}
