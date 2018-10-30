import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { DirectService } from './../../direct/direct.service';
import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  styleUrls: ['./check-eligibility.component.scss']
})
export class CheckEligibilityComponent implements OnInit {
  pageTitle: string;
  isSingaporean = false;
  isAssets = false;

  formValues: any;
  eligibilityForm: FormGroup;
  religion = '';
  religionList;
  errorModal;
  tooltip;
  constructor(
    private formBuilder: FormBuilder,
    private willWritingService: WillWritingService,
    private router: Router,
    private directService: DirectService,
    private modal: NgbModal,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.religionList = this.translate.instant('WILL_WRITING.ELIGIBILITY.RELIGION_LIST');
      this.pageTitle = this.translate.instant('WILL_WRITING.ELIGIBILITY.TITLE');
      this.tooltip = this.translate.instant('WILL_WRITING.ELIGIBILITY.TOOLTIP');
      this.errorModal = this.translate.instant('WILL_WRITING.ELIGIBILITY.MUSLIM_ERROR');
    });
  }

  ngOnInit() {
    this.formValues = this.willWritingService.getEligibilityDetails();
    this.eligibilityForm = this.formBuilder.group({
      singaporean: [this.formValues.singaporean, Validators.required],
      assets: [this.formValues.assets, Validators.required],
      religion : [this.formValues.religion, Validators.required]
    });
    setTimeout(() => {
      if (this.formValues.religion !== undefined) {
        const index = this.religionList.findIndex((status) => status.value === this.formValues.religion);
        this.selectReligion(this.religionList[index]);
      }
      if (this.formValues.assets === 'no') {
        this.isAssets = true;
      }
      if (this.formValues.assets === 'no') {
        this.isSingaporean = true;
      }
    }, 100);
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
