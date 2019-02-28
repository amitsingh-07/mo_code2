import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss']
})
export class MyEarningsComponent implements OnInit {
  pageTitle: string;
  myEarningsForm: FormGroup;
  employmentType = '';
  employmentTypeList: any;
  monthlyRentIncome = false;
  othermonthlyWorkIncome = false;
  otherMonthlyIncome = false;
  annualDividends = false;
  otherAnnualIncomeType = false;

  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
      this.employmentTypeList = this.translate.instant('MY_EARNINGS.EMPLOYMENT_TYPE_LIST');

      this.setPageTitle(this.pageTitle);
    });

  }
  ngOnInit() {
    this.buildMyEarningsForm();
  }

  SelectEarningsType(earningsType) {

    switch (earningsType) {
     case 'monthlyRentIncome':
     this.monthlyRentIncome = true;
     break;
     case 'othermonthlyWorkIncome':
     this.othermonthlyWorkIncome = true;
     break;
     case 'otherMonthlyIncome':
     this.otherMonthlyIncome = true;
     break;
     case 'annualDividends':
     this.annualDividends = true;
     break;
     case 'otherAnnualIncomeType':
     this.otherAnnualIncomeType = true;
     break;
    }
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  buildMyEarningsForm() {
    this.myEarningsForm = this.formBuilder.group({
      employmentType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      monthlySalary: ['', [Validators.required]],
      rentalIncome: ['', [Validators.required]],
      otherIncome: ['', [Validators.required]],
      otherMonthlyIncome: ['', [Validators.required]],
      annualBonus: ['', [Validators.required]],
      otherAnnualIncome: ['', [Validators.required]]
    });
  }
  selectEmploymentType(employmentType) {
    employmentType = employmentType ? employmentType : { text: '', value: '' };
    this.employmentType = employmentType.text;
    this.myEarningsForm.controls['employmentType'].setValue(employmentType.value);
    this.myEarningsForm.markAsDirty();
  }
  goToNext() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS]);
  }
}
