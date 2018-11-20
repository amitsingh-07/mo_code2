import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  styleUrls: ['./check-eligibility.component.scss']
})
export class CheckEligibilityComponent implements OnInit, OnDestroy {
  pageTitle: string;
  isSingaporean = false;
  isAssets = false;

  formValues: any;
  eligibilityForm: FormGroup;
  religion = '';
  religionList;
  errorModal;
  tooltip;
  private subscription: Subscription;
  unsavedMsg: string;
  constructor(
    private formBuilder: FormBuilder,
    private willWritingService: WillWritingService,
    private router: Router,
    public footerService: FooterService,
    private _location: Location,
    private modal: NgbModal, public navbarService: NavbarService,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.religionList = this.translate.instant('WILL_WRITING.ELIGIBILITY.RELIGION_LIST');
      this.pageTitle = this.translate.instant('WILL_WRITING.ELIGIBILITY.TITLE');
      this.tooltip = this.translate.instant('WILL_WRITING.ELIGIBILITY.TOOLTIP');
      this.errorModal = this.translate.instant('WILL_WRITING.ELIGIBILITY.MUSLIM_ERROR');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.formValues = this.willWritingService.getEligibilityDetails();
    this.eligibilityForm = this.formBuilder.group({
      singaporean: [this.formValues.singaporean, Validators.required],
      assets: [this.formValues.assets, Validators.required],
      religion : [this.formValues.religion, Validators.required]
    });
    if (this.formValues.assets === 'no') {
      this.isAssets = true;
    }
    if (this.formValues.singaporean === 'no') {
      this.isSingaporean = true;
    }
    setTimeout(() => {
      if (this.formValues.religion !== undefined) {
        const index = this.religionList.findIndex((status) => status.value === this.formValues.religion);
        this.selectReligion(this.religionList[index]);
      }
    }, 100);
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.eligibilityForm.dirty) {
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

  selectReligion(religion) {
    religion = religion ? religion : {text: '', value: ''};
    this.religion = religion.text;
    this.eligibilityForm.controls['religion'].setValue(religion.value);
  }

  changeState(event) {
    if (event && event['target'].value === 'no') {
      this.isSingaporean = true;
    } else {
      this.isSingaporean = false;
    }
  }

  changeAssets(event) {
    if (event && event['target'].value === 'no') {
      this.isAssets = true;
    } else {
      this.isAssets = false;
    }
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    } else if (form.value.religion === 'muslim') {
      this.openErrorModal();
      return false;
    }
    this.willWritingService.setEligibilityDetails(form.value);
    return true;
  }

  openToolTipModal() {
    const title = this.tooltip.TITLE;
    const message = this.tooltip.MESSAGE;
    this.willWritingService.openToolTipModal(title, message);
  }

  openErrorModal() {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.errorModal.TITLE;
      ref.componentInstance.errorMessage = this.errorModal.MESSAGE;
      ref.componentInstance.navToHome = true;
      ref.result.then(() => {
        this.router.navigate(['home']);
      }).catch((e) => {
      });
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.TELL_US_ABOUT_YOURSELF]);
    }
  }

}
