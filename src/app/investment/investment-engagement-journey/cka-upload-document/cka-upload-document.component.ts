import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-cka-upload-document',
  templateUrl: './cka-upload-document.component.html',
  styleUrls: ['./cka-upload-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkaUploadDocumentComponent implements OnInit {
  pageTitle: string;

  constructor(public readonly translate: TranslateService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('NONE_OF_THE_ABOVE.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
}
