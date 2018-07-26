import { TranslateService } from '@ngx-translate/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';
import { IMyAssets } from './my-assets.interface';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements IPageComponent, OnInit {
  pageTitle: string;
  assetsForm: FormGroup;
  assetsFormValues: IMyAssets;
  assetsTotal: any;

  constructor(
    private router: Router, public headerService: HeaderService,
    private guideMeService: GuideMeService, private translate: TranslateService) {
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
        this.setPageTitle(this.pageTitle);
      });
  }

  ngOnInit() {
    this.assetsFormValues = this.guideMeService.getMyAssets();
    this.assetsForm = new FormGroup({
      cash: new FormControl(this.assetsFormValues.cash, Validators.required),
      cpf: new FormControl(this.assetsFormValues.cpf, Validators.required),
      homeProperty: new FormControl(this.assetsFormValues.homeProperty, Validators.required),
      investmentProperties: new FormControl(this.assetsFormValues.investmentProperties, Validators.required),
      investments: new FormControl(this.assetsFormValues.investments, Validators.required),
      others: new FormControl(this.assetsFormValues.others, Validators.required)
    });

    this.setFormTotalValue();
  }

  setFormTotalValue() {
    this.assetsTotal = this.guideMeService.additionOfCurrency(this.assetsForm.value);
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    if (form.valid) {
      this.guideMeService.setMyAssets(form.value);
    }
    return true;
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goToNext(form) {
    this.router.navigate(['../guideme/liabilities']);
  }
}
