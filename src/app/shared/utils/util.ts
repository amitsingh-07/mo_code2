import { Injectable } from '@angular/core';
import { AppConfigService } from './../../app-config.service';

@Injectable()
export class Util {
    public static getApiBaseUrl(): string {
        let apiBaseUrl = '';
        if (window.location.href.indexOf('localhost') >= 0 || window.location.port === '4200') {
            apiBaseUrl = AppConfigService.settings.apiBaseUrl;
        }

        return apiBaseUrl;
    }
}
