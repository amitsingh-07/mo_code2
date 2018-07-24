import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-protection-needs',
  templateUrl: './protection-needs.component.html',
  styleUrls: ['./protection-needs.component.scss']
})
export class ProtectionNeedsComponent implements IPageComponent, OnInit {
  protectionNeedsForm: FormGroup;
  protectionNeedsArray: FormArray;
  protectionNeedsList: any[];
  formValues: any;
  isFormLoaded: boolean;
  currentFormData: any;

  pageTitle: string;
  subTitle: string;

  constructor(
    private formBuilder: FormBuilder, private guideMeService: GuideMeService,
    private router: Router, public headerService: HeaderService) {
    this.pageTitle = 'Protection Needs';
    this.subTitle = 'Here are the protection type(s) recommended for you. Uncheck those that are not a priority.';
  }

  ngOnInit() {
    this.setPageTitle(this.pageTitle);
    this.isFormLoaded = false;
    this.protectionNeedsForm = this.formBuilder.group({
      protectionNeedsArray: this.formBuilder.array([])
    });
    this.guideMeService.getProtectionNeedsList().subscribe((data) => {
      this.buildForm(data.objectList);
      this.protectionNeedsList = data.objectList;
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title, this.subTitle);
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
      status: this.formValues.protectionNeedData ? this.formValues.protectionNeedData[i].status : true,
      protectionTypeId: responseObj.protectionTypeId,
      protectionType: responseObj.protectionType,
      protectionDesc: responseObj.protectionDesc
    });
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
    this.router.navigate(['../guideme/income']);
  }
}
