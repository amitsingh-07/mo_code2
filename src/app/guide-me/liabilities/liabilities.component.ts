import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';
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
    private router: Router, public navbarService: NavbarService,
    private guideMeService: GuideMeService, private translate: TranslateService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_LIABILITIES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.assetsFormValues = this.guideMeService.getMyLiabilities();
    this.liabilitiesForm = new FormGroup({
      propertyLoan: new FormControl(this.assetsFormValues.propertyLoan),
      carLoan: new FormControl(this.assetsFormValues.carLoan),
      otherLoan: new FormControl(this.assetsFormValues.otherLoan)
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
    Object.keys(form.value).forEach((key) => {
      if (isNaN) {
        form.value[key] = 0;
      }
    });
    this.guideMeService.setMyLiabilities(form.value);
    return true;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.INSURE_ASSESSMENT]);
    }
  }
}
