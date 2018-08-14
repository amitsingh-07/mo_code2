import 'rxjs/add/operator/map';

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';

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
  hospitalPlanFormValues: any;
  hospitalPlanList: any[];

  constructor(
    private router: Router,
    private translate: TranslateService, private guideMeService: GuideMeService,
    public modal: NgbModal, public headerService: HeaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('HOSPITAL_PLAN.TITLE');
      this.pageSubTitle = this.translate.instant('HOSPITAL_PLAN.SUB_TITLE');
      this.setPageTitle(this.pageTitle, this.pageSubTitle);
    });
  }

  ngOnInit() {
    this.hospitalPlanFormValues = this.guideMeService.getGuideMeFormData();
    this.hospitalPlanForm = new FormGroup({
      hospitalPlan: new FormControl(this.hospitalPlanFormValues.hospitalPlanData, Validators.required)
    });

    this.guideMeService.getHospitalPlanList().subscribe((data) => {
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

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setHospitalPlan(form.value);
      return true;
    }
    return false;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.protectionNeedsPageIndex++;
      });
    }
  }

}
