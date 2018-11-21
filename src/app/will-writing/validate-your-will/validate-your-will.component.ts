import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';

@Component({
  selector: 'app-validate-your-will',
  templateUrl: './validate-your-will.component.html',
  styleUrls: ['./validate-your-will.component.scss']
})
export class ValidateYourWillComponent implements OnInit, OnDestroy {
  pageTitle: string;
  constructor(private translate: TranslateService,
              public footerService: FooterService,
              private router: Router,
              public navbarService: NavbarService,
              private willWritingApiService: WillWritingApiService) {
    this.translate.use('en');
    this.pageTitle = this.translate.instant('WILL_WRITING.VALIDATE_YOUR_WILL.TITLE');
    this.setPageTitle(this.pageTitle);
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.navbarService.setNavbarMode(4);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  editWill() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.CONFIRMATION]);
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
  }

  downloadWill() {
    this.willWritingApiService.downloadWill().subscribe((data: any) => {
      this.downloadFile(data);
    }, (error) => console.log(error));
  }
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

}
