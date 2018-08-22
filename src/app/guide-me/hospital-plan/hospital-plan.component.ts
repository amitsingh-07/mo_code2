import { GuideMeApiService } from './../guide-me.api.service';
import 'rxjs/add/operator/map';

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';
import { HospitalPlan } from './hospital-plan';

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

  hospitalPlanForm: FormGroup;
  hospitalPlanFormValues: HospitalPlan;
  hospitalPlanList: any[];
  isFormValid = false;

  constructor(
    private router: Router,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal, public headerService: HeaderService,
    private guideMeApiService: GuideMeApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('HOSPITAL_PLAN.TITLE');
      this.pageSubTitle = this.translate.instant('HOSPITAL_PLAN.SUB_TITLE');
      this.setPageTitle(this.pageTitle, this.pageSubTitle);
    });
  }

  ngOnInit() {
    this.hospitalPlanFormValues = this.guideMeService.getHospitalPlan();
    this.hospitalPlanForm = new FormGroup({
      hospitalPlan: new FormControl(this.hospitalPlanFormValues, Validators.required)
    });

    this.guideMeApiService.getHospitalPlanList().subscribe((data) => {
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

  validateForm(hospitalPlan) {
    this.hospitalPlanFormValues = hospitalPlan;
    this.isFormValid = true;
  }

  save() {
      const selectedPlan: HospitalPlan = {
        hospitalClass: this.hospitalPlanFormValues.hospitalClass,
        hospitalClassDescription: this.hospitalPlanFormValues.hospitalClassDescription,
        hospitalClassId: this.hospitalPlanFormValues.hospitalClassId,
        isFullRider: false
      };
      this.guideMeService.setHospitalPlan(selectedPlan);
      return true;
  }

  goToNext(form) {
    if (this.save()) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.protectionNeedsPageIndex++;
      });
    }
  }

}
