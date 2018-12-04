import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';
import { AppService } from './../../app.service';

@Component({
  selector: 'app-validate-your-will',
  templateUrl: './validate-your-will.component.html',
  styleUrls: ['./validate-your-will.component.scss']
})
export class ValidateYourWillComponent implements OnInit, OnDestroy {
  pageTitle: string;
  customerId: string;
  constructor(
    private translate: TranslateService,
    public footerService: FooterService, private appService: AppService,
    private router: Router,
    public navbarService: NavbarService,
    private willWritingApiService: WillWritingApiService) {
    this.translate.use('en');
    this.pageTitle = this.translate.instant('WILL_WRITING.VALIDATE_YOUR_WILL.TITLE');
    this.setPageTitle(this.pageTitle);
    this.customerId = this.appService.getCustomerId();
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
      this.saveAs(data);
    }, (error) => console.log(error));
  }

  saveAs(data) {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const otherBrowsers = /Android|Windows/.test(navigator.userAgent);

    const blob = new Blob([data], { type: 'application/pdf' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'MoneyOwl Will writing.pdf');
    } else if ((isSafari && iOS) || otherBrowsers || isSafari) {
      this.downloadFile(data);
    } else {
      const reader: any = new FileReader();
      const out = new Blob([data], { type: 'application/pdf' });
      reader.onload = ((e) => {
        window.open(reader.result);
      });
      reader.readAsDataURL(out);
    }
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'MoneyOwl Will Writing.pdf';
    a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

  }

  }
