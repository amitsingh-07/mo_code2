import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { FooterService } from './../../shared/footer/footer.service';

@Component({
  selector: 'app-why-money-owl',
  templateUrl: './why-money-owl.component.html',
  styleUrls: ['./why-money-owl.component.scss']
})
export class WhyMoneyOwlComponent implements OnInit {
  public pageTitle: string;

  public headerDesc: string;
  public whyMoneyowlSections = [];

  constructor(public navbarService: NavbarService, public footerService: FooterService, public translate: TranslateService,
              public title: Title, public meta: Meta) {
                navbarService.setNavbarVisibility(true);
                navbarService.setNavbarMode(1);
                footerService.setFooterVisibility(true);
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {
                this.pageTitle = this.translate.instant('ABOUT_US.TITLE');
                this.headerDesc = this.translate.instant('WHY_MONEYOWL.GENERAL.HEADER.DESCRIPTION');
                this.whyMoneyowlSections = this.translate.instant('WHY_MONEYOWL.GENERAL.VALUE_PROP');
                console.log(this.whyMoneyowlSections);
                // meta tag and title
                this.title.setTitle(this.translate.instant('ABOUT_US.TITLE'));
                this.meta.addTag({name: 'description', content: this.translate.instant('WHY_BUY.META.META_DESCRIPTION')});
                this.meta.addTag({name: 'keywords', content: this.translate.instant('WHY_BUY.META.META_KEYWORDS')});
                this.meta.addTag({name: 'author', content: this.translate.instant('WHY_BUY.META.META_AUTHOR')});
                this.meta.addTag({name: 'copyright', content: this.translate.instant('WHY_BUY.META.META_COPYRIGHT')});
      });
              }

  ngOnInit() {
  }

}
