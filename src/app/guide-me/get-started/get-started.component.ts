import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GuideMeService } from '../guide-me.service';
import { HeaderService } from './../../shared/header/header.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements IPageComponent, OnInit {

  pageTitle: string;
  getStartedForm: FormGroup;
  getStartedFormValues: any;

  constructor(public headerService: HeaderService, private guideMeService: GuideMeService) { }

  ngOnInit() {
    this.headerService.setPageTitle('Get Started');
    this.getStartedFormValues = this.guideMeService.getGuideMeFormData();
    this.getStartedForm = new FormGroup({
      gender: new FormControl(this.getStartedFormValues.gender, Validators.required),
      dob: new FormControl(this.getStartedFormValues.dob, Validators.required),
      isSmoker: new FormControl(this.getStartedFormValues.isSmoker, Validators.required),
      dependents: new FormControl(this.getStartedFormValues.dependents, Validators.required)
    });
  }

}
