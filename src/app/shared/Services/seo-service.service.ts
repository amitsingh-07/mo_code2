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
    this.meta.updateTag({ name: 'keywords', content: keyword });
    // Social Media Facebook
    this.meta.updateTag({ property: 'og:title', content: in_title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: thumbnailImageUrl });

    // Social Media Twitter
    this.meta.updateTag({ property: 'twitter:title', content: in_title });
    this.meta.updateTag({ property: 'twitter:description', content: description });
    this.meta.updateTag({ property: 'twitter:url', content: url });
    this.meta.updateTag({ property: 'twitter:image', content: thumbnailImageUrl });
  }

}
