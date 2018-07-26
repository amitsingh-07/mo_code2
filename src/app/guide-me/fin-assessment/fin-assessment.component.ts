import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { HeaderService } from './../../shared/header/header.service';
import { GuideMeService } from './../guide-me.service';


@Component({
  selector: 'app-fin-assessment',
  templateUrl: './fin-assessment.component.html',
  styleUrls: ['./fin-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinAssessmentComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(
    private guideMeService: GuideMeService, private router: Router,
    public headerService: HeaderService,
    public readonly translate: TranslateService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FINANCIAL_ASSESSMENT.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goNext() {
    this.router.navigate(['../guideme/income']);
  }
}
