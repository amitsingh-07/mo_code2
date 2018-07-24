import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements IPageComponent, OnInit {
  pageTitle: string;
  incomeForm: FormGroup;
  incomeFormValues: any;

  constructor(private router: Router, public headerService: HeaderService) { 
    this.pageTitle = 'My Income';
    this.incomeFormValues = {
      'monthlySalary': 0,
      'annualBonus': 0,
      'otherIncome': 0
    }
  }

  ngOnInit() {
    this.setPageTitle(this.pageTitle);
    this.incomeForm = new FormGroup({
      monthlySalary: new FormControl(this.incomeFormValues.monthlySalary, Validators.required),
      annualBonus: new FormControl(this.incomeFormValues.annualBonus, Validators.required),
      otherIncome: new FormControl(this.incomeFormValues.otherIncome, Validators.required)
    });
  }
  
  setPageTitle(title: string){
    this.headerService.setPageTitle(title);
  }

  goToNext(form) {
      this.router.navigate(['../guideme/expenses']);
  }
}
