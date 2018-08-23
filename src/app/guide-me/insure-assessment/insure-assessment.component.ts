import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-insure-assessment',
  templateUrl: './insure-assessment.component.html',
  styleUrls: ['./insure-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsureAssessmentComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(
    private guideMeService: GuideMeService, private router: Router,
    public headerService: HeaderService,
    public readonly translate: TranslateService) {

    this.translate.use('en');
  }
  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
  }

  setPageTitle(title: string) {
  }

  goNext() {
    this.guideMeService.clearProtectionNeedsData();
    this.guideMeService.protectionNeedsPageIndex = 0;
    this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
      this.guideMeService.protectionNeedsPageIndex++;
    });
  }
}
