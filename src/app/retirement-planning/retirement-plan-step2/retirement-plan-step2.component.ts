import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-retirement-plan-step2',
  templateUrl: './retirement-plan-step2.component.html',
  styleUrls: ['./retirement-plan-step2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanStep2Component implements OnInit {
  pageTitle: string;
  personalizeYourRetireForm: FormGroup;
  personalizeYourRetireArray: FormArray;

  constructor(
    public navbarService: NavbarService,
    private translate: TranslateService,
    private formBuilder: FormBuilder
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RETIREMENT_PLANNING.STEP_2.TITLE');
      this.navbarService.setPageTitle(
        this.pageTitle,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarShadowVisibility(false); 
    
    this.personalizeYourRetireForm = this.formBuilder.group({
      protectionNeedsArray: this.formBuilder.group({
        stableIncomeStream: this.formBuilder.control(''),
        flexibleIncomeStream: this.formBuilder.control(''),
        longerPeriodOfIncome: this.formBuilder.control(''),
      })
    });
  }

}
