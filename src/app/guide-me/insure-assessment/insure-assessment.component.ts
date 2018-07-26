import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';
import { HeaderService } from './../../shared/header/header.service';


@Component({
  selector: 'app-insure-assessment',
  templateUrl: './insure-assessment.component.html',
  styleUrls: ['./insure-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsureAssessmentComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(private guideMeService: GuideMeService, private router: Router,
              public headerService: HeaderService,
              public readonly translate: TranslateService) {
                this.pageTitle = this.translate.instant('INSURE_ASSESSMENT.TITLE');
              }

  ngOnInit() {
    this.translate.use('en');
    this.setPageTitle(this.pageTitle);
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goNext() {
    console.log('Next Page');
  }
}
