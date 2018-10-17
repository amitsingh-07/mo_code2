import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';
import { IMyIncome } from './income.interface';

const Regexp = new RegExp('[,]', 'g');

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeComponent implements IPageComponent, OnInit, AfterViewInit {

  someRange3 = 0;

  isUserInputIncome = false;

  pageTitle: string;
  incomeForm: FormGroup;
  incomeFormValues: IMyIncome;
  incomeTotal = 0;

  private el: HTMLInputElement;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    private currencyPipe: CurrencyPipe) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_INCOME.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.incomeFormValues = this.guideMeService.getMyIncome();
    this.incomeForm = new FormGroup({
      monthlySalary: new FormControl(this.incomeFormValues.monthlySalary),
      annualBonus: new FormControl(this.incomeFormValues.annualBonus),
      otherIncome: new FormControl(this.incomeFormValues.otherIncome)
    });
    this.setFormTotalValue();
  }

  ngAfterViewInit() {
    this.isUserInputIncome = false;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  setFormTotalValue() {
    this.incomeTotal = this.guideMeService.additionOfCurrency(this.incomeForm.value);
  }

  onNoUiSliderChange(sliderValue) {
    let value = sliderValue;
    if (value !== null) {
      value = value.toString().replace(Regexp, '');
    }
    let amount = this.currencyPipe.transform(value, 'USD');
    if (amount !== null) {
      amount = amount.split('.')[0].replace('$', '');
      this.incomeForm.controls['otherIncome'].setValue(amount);
      this.setFormTotalValue();
    }
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
    this.guideMeService.setMyIncome(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.EXPENSES]);
    }
  }
}
