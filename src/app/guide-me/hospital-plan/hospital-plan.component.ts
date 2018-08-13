import 'rxjs/add/operator/map';

import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-hospital-plan',
  templateUrl: './hospital-plan.component.html',
  styleUrls: ['./hospital-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HospitalPlanComponent implements IPageComponent, OnInit {

  pageTitle: string;
  pageSubTitle: string;
  isFormValid = true; // Boolean for preload check

  hospitalPlanArray: FormArray; // Array to do a preload check
  hospitalPlanForm: FormGroup; // Working FormGroup
  hospitalPlanFormValues: any;
  hospitalPlanList: any[];

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
      this.pageTitle = this.translate.instant('HOSPITAL_PLAN.TITLE');
      this.pageSubTitle = this.translate.instant('HOSPITAL_PLAN.SUB_TITLE');
      this.setPageTitle(this.pageTitle, this.pageSubTitle);
    });
  }

  ngOnInit() {
    this.isFormLoaded = false;
    this.hospitalPlanForm = this.formBuilder.group({
      hospitalPlanArray: this.formBuilder.array([])
    });
    this.hospitalPlanFormValues = this.guideMeService.getGuideMeFormData();

    this.guideMeService.getHospitalPlanList().subscribe((data) => {
      this.buildForm(data.objectList);
      this.hospitalPlanList = data.objectList; // Getting the information from the API
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.protectionNeedsPageIndex--;
  }

  setPageTitle(title: string, subTitle?: string) {
    this.headerService.setPageTitle(title, subTitle, false);
  }

  buildForm(responseData?) {
    this.formValues = this.guideMeService.getHospitalPlan();
    if (responseData) {
      responseData.forEach((currentValue, index) => {
        this.hospitalPlanArray = this.hospitalPlanForm.get('hospitalPlanArray') as FormArray;
        this.hospitalPlanArray.push(this.createItem(currentValue, index));
      });
    }
    this.isFormLoaded = true;
  }
  createItem(responseObj, i): FormGroup {
    return this.formBuilder.group({
      status: (this.formValues.hospitalPlanData && this.formValues.hospitalPlanData[i]) ? this.formValues.hospitalPlanData[i].status : true,
      id: responseObj.id,
      hospitalClass: responseObj.hospitalClass,
      hospitalClassDescription: responseObj.hospitalClassDescription
    });
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setHospitalPlan(form.value);
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

  // Testing
  radioTest() {
    // tslint:disable-next-line:no-commented-code
    // console.log('Changed');
  }
}
