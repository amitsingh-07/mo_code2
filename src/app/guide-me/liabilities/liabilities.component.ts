import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';
import { IMyLiabilities } from './liabilities.interface';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})
export class LiabilitiesComponent implements IPageComponent, OnInit {
  pageTitle: string;
  liabilitiesForm: FormGroup;
  assetsFormValues: IMyLiabilities;
  liabilitiesTotal: number;

  constructor(
    private router: Router, public headerService: HeaderService,
    private guideMeService: GuideMeService, private translate: TranslateService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_LIABILITIES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.assetsFormValues = this.guideMeService.getMyLiabilities();
    this.liabilitiesForm = new FormGroup({
      propertyLoan: new FormControl(this.assetsFormValues.propertyLoan, Validators.required),
      carLoan: new FormControl(this.assetsFormValues.carLoan, Validators.required),
      others: new FormControl(this.assetsFormValues.otherLiabilities, Validators.required)
    });

    this.setFormTotalValue();
  }

  setFormTotalValue() {
    this.liabilitiesTotal = this.guideMeService.additionOfCurrency(this.liabilitiesForm.value);
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setMyLiabilities(form.value);
    }
    return true;
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  goToNext() {
    this.router.navigate(['../guideme/insure-assessment']);
  }
}
