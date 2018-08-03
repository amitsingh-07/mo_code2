import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultFormatter, NouisliderComponent } from 'ng2-nouislider';

import { FormControl, FormGroup } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from './../guide-me.service';
import { IMyIncome } from './income.interface';

const Regexp = new RegExp('[,]', 'g');

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeComponent implements IPageComponent, OnInit, AfterViewInit {
  @ViewChild('noUiSlider') noUiSlider: NouisliderComponent;

  someRange3 = 0;
  formatter: DefaultFormatter;

  isUserInputIncome = false;

  pageTitle: string;
  incomeForm: FormGroup;
  incomeFormValues: IMyIncome;
  incomeTotal: any;

  incomeSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: (value) => {
        return Math.round(value);
      },
      from: (value) => {
        return Math.round(value);
      }
    }
  };

  private el: HTMLInputElement;

  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    private currencyPipe: CurrencyPipe) {

    this.formatter = new DefaultFormatter();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_INCOME.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.incomeFormValues = this.guideMeService.getMyIncome();
    this.incomeForm = new FormGroup({
      monthlySalary: new FormControl(this.incomeFormValues.monthlySalary),
      annualBonus: new FormControl(this.incomeFormValues.annualBonus),
      otherIncome: new FormControl(this.incomeFormValues.otherIncome)
    });

    this.setFormTotalValue();
    this.noUiSlider.registerOnTouched(() => {
      console.log('inside touched listener');
      return 0;
    });
  }

  ngAfterViewInit() {
    this.updateSlider();
    this.isUserInputIncome = false;
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
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

  updateSlider() {
    this.isUserInputIncome = true;
    let sliderValue = this.incomeForm.controls['otherIncome'].value;
    if (sliderValue === null) {
      sliderValue = 0;
    }
    sliderValue = (sliderValue + '').replace(Regexp, '');
    this.noUiSlider.writeValue(sliderValue);

  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    this.guideMeService.setMyIncome(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.EXPENSES]);
    }
  }
}
