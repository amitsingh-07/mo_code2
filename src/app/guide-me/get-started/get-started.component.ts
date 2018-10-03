import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(
    public navbarService: NavbarService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GET_STARTED.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
}
