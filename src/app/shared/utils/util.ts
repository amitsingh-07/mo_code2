import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable()
export class Util {
    public static getApiBaseUrl(): string {
        let apiBaseUrl = '';
        if (window.location.href.indexOf('localhost') >= 0 || window.location.port === '4200') {
            if ((window.location.href.indexOf('dashboard') >= 0) || (window.location.href.indexOf('view-notifications') >= 0) ) {
                apiBaseUrl = 'https://bfa-dev.ntucbfa.cloud';
            } else {
                apiBaseUrl = environment.apiBaseUrl;
            }
        }
        return apiBaseUrl;
    }
}
