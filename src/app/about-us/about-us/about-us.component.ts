import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

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
              public translate: TranslateService, private title: Title, private meta: Meta) {
              this.translate.use('en');
              this.translate.get('COMMON').subscribe((result: string) => {
                this.pageTitle = this.translate.instant('ABOUT_US.TITLE');
                this.people = this.translate.instant('ABOUT_US.PEOPLE.MGT');

                // meta tag and title
                this.title.setTitle(this.translate.instant('ABOUT_US.TITLE'));
                this.meta.addTag({name: 'description', content: this.translate.instant('ABOUT_US.META.META_DESCRIPTION')});
                this.meta.addTag({name: 'keywords', content: this.translate.instant('ABOUT_US.META.META_KEYWORDS')});
                this.meta.addTag({name: 'author', content: this.translate.instant('ABOUT_US.META.META_AUTHOR')});
                this.meta.addTag({name: 'copyright', content: this.translate.instant('ABOUT_US.META.META_COPYRIGHT')});
              });
            }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }
}
