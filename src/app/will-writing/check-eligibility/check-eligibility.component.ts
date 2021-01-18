import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { WillWritingService } from './../will-writing.service';
import { InvestmentAccountService } from './../../investment/investment-account/investment-account-service';

@Component({
  selector: 'app-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  styleUrls: ['./check-eligibility.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckEligibilityComponent implements OnInit, OnDestroy {
  pageTitle: string;
  isSingaporean = false;
  isAssets = false;

  formValues: any;
  eligibilityForm: FormGroup;
  religion = '';
  nationality = '';
  religionList;
  nationalityList;
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
    private investmentAccountService: InvestmentAccountService,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.ELIGIBILITY.TITLE');
      this.tooltip = this.translate.instant('WILL_WRITING.ELIGIBILITY.TOOLTIP');
      this.errorModal = this.translate.instant('WILL_WRITING.ELIGIBILITY.MUSLIM_ERROR');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.setPageTitle(this.pageTitle);
      this.getOptionListCollection();
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.formValues = this.willWritingService.getEligibilityDetails();
    this.eligibilityForm = this.formBuilder.group({
      nationality: [this.formValues.nationality, Validators.required],
      assets: [this.formValues.assets, Validators.required],
      religion : [this.formValues.religion, Validators.required]
    });
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
  }

  getOptionListCollection() {
    forkJoin([this.investmentAccountService.getSpecificDropList('nationalityCode'),
    this.investmentAccountService.getSpecificDropList('religionCode')]).subscribe(results => {
      this.nationalityList = results[0].objectList['nationalityCode'];
      this.religionList = results[1].objectList['religionCode'];
      this.setSavedValues();
    }, (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  setSavedValues() {
    if (this.formValues.assets === 'N') {
      this.isAssets = true;
    }
    if (this.formValues.religion !== undefined) {
      const index = this.religionList.findIndex((status) => status.value === this.formValues.religion);
      this.selectReligion(this.religionList[index]);
    }
    if (this.formValues.nationality !== undefined) {
      const index = this.nationalityList.findIndex((status) => status.value === this.formValues.nationality);
      this.selectNationality(this.nationalityList[index]);
    }
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
    religion = religion ? religion : {name: '', value: ''};
    this.religion = religion.name;
    this.eligibilityForm.controls['religion'].setValue(religion.value);
  }

  changeAssets(event) {
    if (event && event['target'].value === 'N') {
      this.isAssets = true;
    } else {
      this.isAssets = false;
    }
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    } else if (form.value.religion === 'MUSLIM') {
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
      const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'will-custom-modal' });
      ref.componentInstance.errorTitle = this.errorModal.TITLE;
      ref.componentInstance.errorMessage = this.errorModal.MESSAGE;
      ref.componentInstance.navToHome = true;
      ref.result.then(() => {
        window.open('/', '_self')
      }).catch((e) => {
      });
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.TELL_US_ABOUT_YOURSELF]);
    }
  }

  selectNationality(nationality) {
    if (nationality.value === 'SPR' ||  nationality.value === 'OTH') {
      this.isSingaporean = true;
    } else {
      this.isSingaporean = false;
    }
    nationality = nationality ? nationality : {name: '', value: ''};
    this.nationality = nationality.name;
    this.eligibilityForm.controls['nationality'].setValue(nationality.value);
  }

}
