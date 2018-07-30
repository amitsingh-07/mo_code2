import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';
import { IMyExpenses } from './expenses.interface';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements IPageComponent, OnInit {
  pageTitle: string;
  expensesForm: FormGroup;
  expensesFormValues: IMyExpenses;
  expensesTotal: any;

  constructor(
    private router: Router, public headerService: HeaderService,
    private guideMeService: GuideMeService, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_EXPENSES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.expensesFormValues = this.guideMeService.getMyExpenses();
    this.expensesForm = new FormGroup({
      monthlyInstallment: new FormControl(this.expensesFormValues.monthlyInstallment),
      otherExpenses: new FormControl(this.expensesFormValues.otherExpenses)
    });

    this.setFormTotalValue();
  }

  setFormTotalValue() {
    this.expensesTotal = this.guideMeService.additionOfCurrency(this.expensesForm.value);
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    this.guideMeService.setMyExpenses(form.value);
    return true;
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate(['../guideme/assets']);
    }
  }
}
