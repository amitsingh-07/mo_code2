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

    public static sortAsString(objectValue: any): string {
        let oldObj = objectValue;
        let obj = (oldObj.length || oldObj.length === 0) ? [] : {};
        for (let key of Object.keys(this).sort((a, b) => a.localeCompare(b))) {
            let type = typeof (oldObj[key])
            if (type === 'object') {
                obj[key] = oldObj[key].stringifySorted();
            } else {
                obj[key] = oldObj[key];
            }
        }
        return JSON.stringify(obj);
    }

    public static getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    public static sortDescending(list): any[] {
       return list.sort((a, b) => b - a);
    }
}
