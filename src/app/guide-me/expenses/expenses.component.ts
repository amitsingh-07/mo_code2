import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
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
    private router: Router, public navbarService: NavbarService,
    private guideMeService: GuideMeService, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_EXPENSES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.expensesFormValues = this.guideMeService.getMyExpenses();
    this.expensesForm = new FormGroup({
      monthlyInstallments: new FormControl(this.expensesFormValues.monthlyInstallments),
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
    Object.keys(form.value).forEach((key) => {
      if (!form.value[key] || isNaN(form.value[key])) {
        form.value[key] = 0;
      }
    });
    this.guideMeService.setMyExpenses(form.value);
    return true;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.ASSETS]);
    }
  }
}
