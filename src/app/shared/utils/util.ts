import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable()
export class Util {
    public static getApiBaseUrl(): string {
        let apiBaseUrl = '';
        if (window.location.href.indexOf('localhost') >= 0 || window.location.port === '4200') {
            apiBaseUrl = environment.apiBaseUrl;
        }

        return apiBaseUrl;
    }
}