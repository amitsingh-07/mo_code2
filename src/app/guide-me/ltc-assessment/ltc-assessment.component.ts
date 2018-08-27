import 'rxjs/add/operator/map';

import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';
import { MobileModalComponent } from '../mobile-modal/mobile-modal.component';
import { GuideMeApiService } from './../guide-me.api.service';
import { LongTermCare } from './ltc-assessment';

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
  longTermCareForm: FormGroup; // Working FormGroup
  longTermCareFormValues: LongTermCare;
  longTermCareList: any[];
  isFormValid = false;

  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder, private router: Router,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal, public headerService: HeaderService,
    private guideMeApiService: GuideMeApiService
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
    this.longTermCareFormValues = this.guideMeService.getLongTermCare();
    this.longTermCareForm = new FormGroup({
      careGiverType: new FormControl(this.longTermCareFormValues, Validators.required)
    });

    this.guideMeApiService.getLongTermCareList().subscribe((data) => {
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

  validateForm(careGiver) {
    this.longTermCareFormValues = {
      careGiverType: careGiver.careGiverType,
      careGiverDescription: careGiver.careGiverDescription,
      careGiverTypeId: careGiver.id
    } as LongTermCare;
    this.isFormValid = true;
  }

  save(form: any) {
    const selectedCareGiverType: LongTermCare = {
      careGiverType: this.longTermCareFormValues.careGiverType,
      careGiverDescription: this.longTermCareFormValues.careGiverDescription,
      careGiverTypeId: this.longTermCareFormValues.careGiverTypeId,
      monthlyPayout: 0
    };
    this.guideMeService.setLongTermCare(selectedCareGiverType);
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
}
