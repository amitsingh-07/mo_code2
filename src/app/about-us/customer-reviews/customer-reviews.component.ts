import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { SeoServiceService } from './../../shared/Services/seo-service.service';
import { AboutUsApiService } from './../about-us.api.service';
import { AboutUsService } from './../about-us.service';
import { ICustomerReview } from './customer-reviews.interface';

@Component({
  selector: 'app-customer-reviews',
  templateUrl: './customer-reviews.component.html',
  styleUrls: ['./customer-reviews.component.scss']
})
export class CustomerReviewsComponent implements OnInit {
  customerReviewList: ICustomerReview[];

  constructor(public navbarService: NavbarService, public footerService: FooterService,
              public aboutUsApiService: AboutUsApiService, private aboutUsService: AboutUsService,
              private seoService: SeoServiceService, private translate: TranslateService) {
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {
                  // meta tag and title
                  this.seoService.setTitle(this.translate.instant('CUSTOMER_REVIEWS.TITLE'));
                  this.seoService.setBaseSocialMetaTags(this.translate.instant('CUSTOMER_REVIEWS.TITLE'),
                                                        this.translate.instant('CUSTOMER_REVIEWS.META.META_DESCRIPTION'),
                                                        this.translate.instant('CUSTOMER_REVIEWS.META.META_KEYWORDS')
                                                        );
                  });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);

    this.aboutUsApiService.getCustomerReviews().subscribe((data) => {
      this.customerReviewList = this.aboutUsService.getCustomerReview(data);
    });
  }

  getNumber(count) {
    return Array(+count).fill(0).map((x, i ) => i);
  }
}
