import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';

import { FormControl, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';
import { IMyIncome } from './income.interface';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeComponent implements IPageComponent, OnInit {
  @ViewChild('incomeSlider') incomeSlider: jqxSliderComponent;

  pageTitle: string;
  incomeForm: FormGroup;
  incomeFormValues: IMyIncome;
  incomeTotal: any;

  private el: HTMLInputElement;

  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    private currencyPipe: CurrencyPipe) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_INCOME.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.incomeFormValues = this.guideMeService.getMyIncome();
    this.incomeForm = new FormGroup({
      monthlySalary: new FormControl(this.incomeFormValues.monthlySalary, Validators.required),
      annualBonus: new FormControl(this.incomeFormValues.annualBonus, Validators.required),
      otherIncome: new FormControl(this.incomeFormValues.otherIncome, Validators.required)
    });

    this.setFormTotalValue();
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  setFormTotalValue() {
    this.incomeTotal = this.guideMeService.additionOfCurrency(this.incomeForm.value);
  }

  onSliderChange(event: any): void {
    const value = this.incomeSlider.getValue();
    let amount = this.currencyPipe.transform(value, 'USD');
    if (amount !== null) {
      amount = amount.split('.')[0].replace('$', '');
      this.incomeForm.controls['otherIncome'].setValue(amount);
      this.setFormTotalValue();
    }
  }

  updateSlider() {
    this.incomeSlider.setValue(this.incomeForm.controls['otherIncome'].value);
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setMyIncome(form.value);
    }
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate(['../guideme/expenses']);
    }
  }
}
