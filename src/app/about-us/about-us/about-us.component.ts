import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SeoServiceService } from './../../shared/Services/seo-service.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit {
  public pageTitle: string;
  public people: any;

  constructor(private navbarService: NavbarService, private footerService: FooterService, private seoService: SeoServiceService,
              public translate: TranslateService, private title: Title, private meta: Meta, private configService: ConfigService) {

              this.configService.getConfig().subscribe((config) => {
                this.translate.setDefaultLang(config.language);
                this.translate.use(config.language);
              });

              this.translate.get('COMMON').subscribe((result: string) => {
                // tslint:disable-next-line:no-duplicate-string
                this.pageTitle = this.translate.instant('ABOUT_US.TITLE');
                this.people = this.translate.instant('ABOUT_US.PEOPLE.MGT');

                // meta tag and title
                this.seoService.setTitle(this.translate.instant('ABOUT_US.TITLE'));
                this.seoService.setBaseSocialMetaTags(this.translate.instant('ABOUT_US.TITLE'),
                                                      this.translate.instant('ABOUT_US.META.META_DESCRIPTION'),
                                                      this.translate.instant('ABOUT_US.META.META_KEYWORDS')
                                                     );
                this.meta.addTag({name: 'author', content: this.translate.instant('ABOUT_US.META.META_AUTHOR')});
                this.meta.addTag({name: 'copyright', content: this.translate.instant('ABOUT_US.META.META_COPYRIGHT')});
              });
            }

ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }
}
