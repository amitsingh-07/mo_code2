import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements IPageComponent, OnInit {
  pageTitle: string;
  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService) {
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.pageTitle = this.translate.instant('MY_EXPENSES.TITLE');
        this.setPageTitle(this.pageTitle);
      });
  }

  ngOnInit() {
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goToNext(form) {
    this.router.navigate(['../guideme/assets']);
  }
}
