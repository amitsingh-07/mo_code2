import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoServiceService {
  seo_credentials = {
                  default: {
                    default_thumbnail: '/assets/images/'
                  },
                  facebook: {
                    facebook_admin: 'ID here'
                  },
                  twitter: {
                    publisher_handle: '@moneyowlsg',
                    creator_handle: '@moneyowlsg'
                  }
                };
constructor(public meta: Meta, public title: Title, public router: Router) { }
  // Title Features
setTitle(in_title: string) {
    this.title.setTitle(in_title);
  }

  // Meta Tag Features
setBaseSocialMetaTags(in_title: string, description: string, keyword: string, thumbnailImageUrl?: string) {
    const url = 'https://www.moneyowl.com.sg' + this.router.url;
    if (!thumbnailImageUrl) {
      thumbnailImageUrl = this.seo_credentials.default.default_thumbnail;
    }
    // Base Meta Tag
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keyword});
    // Social Media Facebook
    this.meta.updateTag({ property: 'og:title', content: in_title});
    this.meta.updateTag({ property: 'og:description', content: description});
    this.meta.updateTag({ property: 'og:url', content: url});
    this.meta.updateTag({ property: 'og:image', content: thumbnailImageUrl});

    // Social Media Twitter
    this.meta.updateTag({ property: 'twitter:title', content: in_title});
    this.meta.updateTag({ property: 'twitter:description', content: description});
    this.meta.updateTag({ property: 'twitter:url', content: url});
    this.meta.updateTag({ property: 'twitter:image', content: thumbnailImageUrl});
  }

setArticlesMetaTags(in_title: string, summary: string, thumbnailImageUrl: string, keyword: string,
                    author: string, published_time: string, primary_tag: string ) {
    // Set Base Meta Tag
    this.setBaseSocialMetaTags(in_title, summary, keyword, thumbnailImageUrl);
    // Additional Article Based Meta Tagging
    this.meta.updateTag({ property: 'og:author', content: author});
    this.meta.updateTag({ property: 'og:type', content: 'article'});
    this.meta.updateTag({ property: 'og:site_name', content: 'MoneyOwl Articles'});
    this.meta.updateTag({ property: 'article:published_time', content: published_time});
    this.meta.updateTag({ property: 'articles:tag', content: primary_tag});

    this.meta.updateTag({ property: 'twitter:card', content: summary});
    this.meta.updateTag({ property: 'twitter:site', content: this.seo_credentials.twitter.publisher_handle});
    this.meta.updateTag({ property: 'twitter:creator', content: this.seo_credentials.twitter.creator_handle});
    this.meta.updateTag({ property : 'twitter:image:src', content: thumbnailImageUrl});
  }

  //
}
