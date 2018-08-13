import 'rxjs/add/operator/map';

import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { MobileModalComponent } from '../mobile-modal/mobile-modal.component';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ltc-assessment',
  templateUrl: './ltc-assessment.component.html',
  styleUrls: ['./ltc-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LtcAssessmentComponent implements IPageComponent, OnInit, OnDestroy {

  pageTitle: string;
  pageSubTitle: string;
  modalData: any;
  isFormValid = true; // Boolean for preload check
  longTermCareArray: FormArray; // Array to do a preload check
  longTermCareForm: FormGroup; // Working FormGroup
  longTermCareFormValues: any;
  longTermCareList: any[];

  formValues: any;
  isFormLoaded: boolean;
  currentFormData: any;

  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder, private router: Router,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal, public headerService: HeaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('LTC_ASSESSMENT.TITLE');
      this.pageSubTitle = this.translate.instant('LTC_ASSESSMENT.SUB_TITLE');
      this.modalData = this.translate.instant('LTC_ASSESSMENT.MODAL_DATA');
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
    });
    this.subscription = this.headerService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showMobilePopUp();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.protectionNeedsPageIndex--;
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
  }
  createItem(responseObj, i): FormGroup {
    return this.formBuilder.group({
      status: (this.formValues.longTermCareData && this.formValues.longTermCareData[i]) ? this.formValues.longTermCareData[i].status : true,
      id: responseObj.id,
      careGiverType: responseObj.careGiverType,
      careGiverDescription: responseObj.careGiverDescription
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
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.protectionNeedsPageIndex++;
      });
    }
  }

  showMobilePopUp() {
    const ref = this.modal.open(MobileModalComponent, {
      centered: true
    });
    ref.componentInstance.mobileTitle = this.modalData.TITLE;
    ref.componentInstance.description = this.modalData.DESCRIPTION;
    ref.componentInstance.icon_description = this.modalData.LOGO_DESCRIPTION;
    this.headerService.showMobilePopUp('removeClicked');
  }

  // Testing
  radioTest() {
    // tslint:disable-next-line:no-commented-code
    // console.log('Changed');
  }
}
