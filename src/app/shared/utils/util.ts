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

    public static getCurrentServerBaseUrl(): string {
        let apiBaseUrl = window.location.protocol + '//' + window.location.host;
        if (window.location.href.indexOf('localhost') >= 0 || window.location.port === '4200') {
            apiBaseUrl = environment.apiBaseUrl;
        }

        return apiBaseUrl;
    }

    public static sortAsString(objectValue: any): string {
        const oldObj = objectValue;
        const obj = (oldObj.length || oldObj.length === 0) ? [] : {};
        for (const key of Object.keys(this).sort((a, b) => a.localeCompare(b))) {
            const type = typeof (oldObj[key]);
            if (type === 'object') {
                obj[key] = oldObj[key].stringifySorted();
            } else {
                obj[key] = oldObj[key];
            }
        }
        return JSON.stringify(obj);
    }

    public static getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }

    public static sortDescending(list): any[] {
        return list.sort((a, b) => b - a);
    }

    public static isEmptyOrNull(obj: any): boolean {
        let isEmpty = false;
        try {
            if (obj === null) {
                isEmpty = true;
            } else if (typeof obj === 'object') {
                isEmpty = Object.keys(obj).length === 0;
            } else {
                isEmpty = typeof obj === 'undefined' || obj.length <= 0;
            }
        } catch (e) {
            isEmpty = true;
        }
        return isEmpty;
    }

    public static toNumber(value: any): number {
        if (isNaN(parseInt(value, 10))) {
            return 0;
        } else {
            return parseInt(value, 10);
        }
    }
}
