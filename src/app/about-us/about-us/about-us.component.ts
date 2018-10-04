import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit {
  public pageTitle: string;
  public people: any;

  constructor(private navbarService: NavbarService, private footerService: FooterService,
              private translate: TranslateService) {
              this.translate.use('en');
              this.translate.get('COMMON').subscribe((result: string) => {
                this.pageTitle = this.translate.instant('PROFILE.TITLE');
                this.people = this.translate.instant('ABOUT_US.PEOPLE.MGT');
              });
            }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }
}
