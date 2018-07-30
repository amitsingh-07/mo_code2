import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';
import { IMyAssets } from './my-assets.interface';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements IPageComponent, OnInit {
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
      cash: new FormControl(this.assetsFormValues.cash),
      cpf: new FormControl(this.assetsFormValues.cpf),
      homeProperty: new FormControl(this.assetsFormValues.homeProperty),
      investmentProperties: new FormControl(this.assetsFormValues.investmentProperties),
      investments: new FormControl(this.assetsFormValues.investments),
      otherAssets: new FormControl(this.assetsFormValues.otherAssets)
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
    this.guideMeService.setMyAssets(form.value);
    return true;
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate(['../guideme/liabilities']);
    }
  }
}
