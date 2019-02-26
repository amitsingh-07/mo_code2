import 'rxjs/add/operator/map';

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GuideMeApiService } from '../guide-me.api.service';
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
    public modal: NgbModal, public navbarService: NavbarService,
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
    this.navbarService.setNavbarDirectGuided(true);
    this.hospitalPlanFormValues = this.guideMeService.getHospitalPlan();
    this.hospitalPlanForm = new FormGroup({
      hospitalPlan: new FormControl(this.hospitalPlanFormValues.hospitalClassId + '', Validators.required)
    });
    if (this.hospitalPlanFormValues.hospitalClassId) {
      this.isFormValid = true;
    }
    this.guideMeApiService.getHospitalPlanList().subscribe((data) => {
      this.hospitalPlanList = data.objectList; // Getting the information from the API
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.decrementProtectionNeedsIndex();
  }

  setPageTitle(title: string, subTitle?: string) {
    this.navbarService.setPageTitle(title, subTitle, false);
  }

  validateForm(hospitalPlan) {
    this.hospitalPlanFormValues = {
      hospitalClass: hospitalPlan.hospitalClass,
      hospitalClassDescription: hospitalPlan.hospitalClassDescription,
      hospitalClassId: hospitalPlan.id
    } as HospitalPlan;
    this.isFormValid = true;
  }

  save(form) {
    const selectedPlan: HospitalPlan = {
      hospitalClass: this.hospitalPlanFormValues.hospitalClass,
      hospitalClassDescription: this.hospitalPlanFormValues.hospitalClassDescription,
      hospitalClassId: this.hospitalPlanFormValues.hospitalClassId,
      isFullRider: true
    };
    this.guideMeService.setHospitalPlan(selectedPlan);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.incrementProtectionNeedsIndex();
      });
    }
  }

}
