import 'rxjs/add/operator/map';

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ltc-assessment',
  templateUrl: './ltc-assessment.component.html',
  styleUrls: ['./ltc-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LtcAssessmentComponent implements IPageComponent, OnInit {

  pageTitle: string;
  pageSubTitle: string;
  isFormValid = true;// Boolean for preload check
  longTermCareArray: FormArray; // Array to do a preload check
  longTermCareForm: FormGroup; // Working FormGroup
  longTermCareFormValues: any;
  longTermCareList: any[];

  formValues: any;
  isFormLoaded: boolean;
  currentFormData: any;

  constructor(
    private formBuilder: FormBuilder, private router: Router,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal, public headerService: HeaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('LTC_ASSESSMENT.TITLE');
      this.pageSubTitle = this.translate.instant('LTC_ASSESSMENT.SUB_TITLE');
      this.setPageTitle(this.pageTitle, this.pageSubTitle, true);
    });
   }

  ngOnInit() {
    this.isFormLoaded = false;
    this.longTermCareForm = this.formBuilder.group({
      longTermCareArray: this.formBuilder.array([])
    });
    this.longTermCareFormValues = this.guideMeService.getGuideMeFormData();

    this.guideMeService.getLongTermCareList().subscribe((data) => {
      this.buildForm(data.objectList);
      this.longTermCareList = data.objectList; // Getting the information from the API
      console.log(this.longTermCareList);
    });
    this.headerService.currentMobileModalEvent.subscribe((event) => { if (event === 'Clicked') { this.showMobilePopUp(); } });
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, subTitle, helpIcon);
  }

  buildForm(responseData?) {
    this.formValues = this.guideMeService.getLongTermCare();
    if (responseData) {
      responseData.forEach((currentValue, index) => {
        this.longTermCareArray = this.longTermCareForm.get('longTermCareArray') as FormArray;
        this.longTermCareArray.push(this.createItem(currentValue, index));
      });
    }
    this.isFormLoaded = true;
    console.log(this.longTermCareArray);
  }
  createItem(responseObj, i): FormGroup {
    return this.formBuilder.group({
      status: (this.formValues.longTermCareData && this.formValues.longTermCareData[i]) ? this.formValues.longTermCareData[i].status : true,
      id: responseObj.id,
      ltcName: responseObj.ltcName,
      ltcDesc: responseObj.ltcDesc
    });
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setLongTermCare(form.value);
    }
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate(['../guideme/occupational-disability']);
    }
  }

  showMobilePopUp() {
    console.log('Show Mobile Popup Triggered');
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorTitle = 'Long-Term Care';
    ref.componentInstance.errorMessage = '<p></p>';
   }
}