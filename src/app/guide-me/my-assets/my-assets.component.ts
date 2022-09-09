import { Component, HostListener, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { ConfigService, IConfig } from './../../config/config.service';
import { IMyAssets } from './my-assets.interface';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements IPageComponent, OnInit, AfterViewInit {
  myinfoChangeListener: Subscription;
  pageTitle: string;
  assetsForm: FormGroup;
  assetsFormValues: IMyAssets;
  assetsTotal: any;
  cpfValue: number;
  useMyInfo: boolean;
  cpfFromMyInfo = false;

  constructor(
    private router: Router, public navbarService: NavbarService,
    public guideMeApiService: GuideMeApiService, private configService: ConfigService,
    private guideMeService: GuideMeService, private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
      this.setPageTitle(this.pageTitle);
    });

    this.configService.getConfig().subscribe((config: IConfig) => {
      this.useMyInfo = config.useMyInfo;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.assetsFormValues = this.guideMeService.getMyAssets();
    this.cpfFromMyInfo = this.assetsFormValues.cpfFromMyInfo;
    this.assetsForm = new FormGroup({
      cash: new FormControl(this.assetsFormValues.cash),
      cpf: new FormControl(this.assetsFormValues.cpf),
      cpfFromMyInfo: new FormControl(this.cpfFromMyInfo),
      homeProperty: new FormControl(this.assetsFormValues.homeProperty),
      investmentProperties: new FormControl(this.assetsFormValues.investmentProperties),
      otherInvestments: new FormControl(this.assetsFormValues.otherInvestments),
      otherAssets: new FormControl(this.assetsFormValues.otherAssets)
    });

    this.setFormTotalValue();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
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
    Object.keys(form.value).forEach((key) => {
      if (!form.value[key] || isNaN(form.value[key])) {
        form.value[key] = 0;
      }
    });
    this.guideMeService.setMyAssets(form.value);
    return true;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.LIABILITIES]);
    }
  }

  // my-info backup code available with khateeja in /10.4
}
