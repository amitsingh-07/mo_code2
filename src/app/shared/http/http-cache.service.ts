import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

const maxAge = 30000;
@Injectable({ providedIn: 'root' })
export class RequestCache {

    constructor() { }

    cache = new Map();

    private getHashCode(str: string) {
        let hash = 0;
        let i = 0;
        const len = str.length;
        while (i < len) {
            hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }
        return hash;
    }

    private getUrl(req: HttpRequest<any>) {
        let urlParameters = '';
        if (req.body) {
            urlParameters = '?' + this.getHashCode(JSON.stringify(req.body));
        }
        return req.urlWithParams + urlParameters;
    }

    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = this.getUrl(req);
        const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }
        return cached.response;
    }

    put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    }

    reset() {
        this.cache = new Map();
    }
}
