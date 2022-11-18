import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from '../../app.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';
import { FileUtil } from '../../shared/utils/file.util';

@Component({
  selector: 'app-validate-your-will',
  templateUrl: './validate-your-will.component.html',
  styleUrls: ['./validate-your-will.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateYourWillComponent implements OnInit, OnDestroy {
  pageTitle: string;
  constructor(
    private translate: TranslateService,
    public footerService: FooterService, private appService: AppService,
    private router: Router,
    public navbarService: NavbarService,
    private willWritingApiService: WillWritingApiService,
    private fileUtil: FileUtil) {
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
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
  }

  downloadWill() {
    let newWindow;
    if(/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      newWindow = window.open();
    }
    this.willWritingApiService.downloadWill().subscribe((data: any) => {
      this.fileUtil.downloadPDF(data, newWindow, this.translate.instant('WILL_WRITING.VALIDATE_YOUR_WILL.WILLS_PDF_NAME'));
    }, (error) => console.log(error));
  }

  saveAs(data) {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const otherBrowsers = /Android|Windows/.test(navigator.userAgent);

    const blob = new Blob([data], { type: 'application/pdf' });
    const nav = (window.navigator as any);
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, 'MoneyOwl Will writing.pdf');
    } else {
      this.downloadFile(data);
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
