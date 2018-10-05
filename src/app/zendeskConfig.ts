import {ngxZendeskWebwidgetConfig } from 'ngx-zendesk-webwidget';

export class ZendeskConfig extends ngxZendeskWebwidgetConfig {
    accountUrl = 'enquiry@diyinsurance.com.sg';
    beforePageLoad(zE) {
      zE.setLocale('en');
      zE.hide();
    }
  }
