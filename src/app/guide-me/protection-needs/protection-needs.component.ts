import { GuideMeApiService } from './../guide-me.api.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';
import { ProtectionNeeds } from './protection-needs';

@Component({
  selector: 'app-protection-needs',
  templateUrl: './protection-needs.component.html',
  styleUrls: ['./protection-needs.component.scss']
})
export class ProtectionNeedsComponent implements IPageComponent, OnInit {
  isFormValid = true;
  protectionNeedsForm: FormGroup;
  protectionNeedsArray: FormArray;
  protectionNeedsList: any[];
  formValues: ProtectionNeeds[];
  isFormLoaded: boolean;
  currentFormData: any;

  pageTitle: string;
  subTitle: string;

  constructor(
    private formBuilder: FormBuilder, private guideMeService: GuideMeService,
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeApiService: GuideMeApiService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROTECTION_NEEDS.TITLE');
      this.subTitle = this.translate.instant('PROTECTION_NEEDS.DESCRIPTION');
      this.setPageTitle(this.pageTitle, this.subTitle);
    });
  }

  ngOnInit() {
    this.isFormLoaded = false;
    this.protectionNeedsForm = this.formBuilder.group({
      protectionNeedsArray: this.formBuilder.array([])
    });
    this.guideMeApiService.getProtectionNeedsList().subscribe((data) => {
      this.buildForm(data.objectList);
      this.protectionNeedsList = data.objectList;
    });
  }

  setPageTitle(title: string, subTitle: string) {
    this.headerService.setPageTitle(title, subTitle);
  }

  buildForm(responseData?) {
    this.formValues = this.guideMeService.getProtectionNeeds();
    if (responseData) {
      responseData.forEach((currentValue, index) => {
        this.protectionNeedsArray = this.protectionNeedsForm.get('protectionNeedsArray') as FormArray;
        this.protectionNeedsArray.push(this.createItem(currentValue, index));
      });
    }
    this.isFormLoaded = true;
  }
  createItem(responseObj, i): FormGroup {
    return this.formBuilder.group({
      status: (this.formValues && this.formValues[i] && this.formValues[i].status)
        ? this.formValues[i].status : true,
      protectionTypeId: responseObj.protectionTypeId,
      protectionType: responseObj.protectionType,
      protectionDesc: responseObj.protectionDesc
    });
  }
  validateForm(form: any) {
    this.isFormValid = this.save(form);
  }
  save(form: any) {
    this.currentFormData = this.protectionNeedsForm.value.protectionNeedsArray;
    const isChecked = this.currentFormData.some((el) => {
      return el.status === true;
    });
    if (!isChecked) {
      return false;
    }
    this.guideMeService.setProtectionNeeds(this.currentFormData);
    return true;
  }

  goToNext(form: any) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.FINANCIAL_ASSESSMENT]);
    }
  }
}
