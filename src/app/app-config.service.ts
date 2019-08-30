import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEnvironment } from './../environments/environment.interface';

@Injectable({
    providedIn: 'root'
  })
export class AppConfigService {
    static settings: IEnvironment;

    constructor(private http: HttpClient) {}
    load() {

        const jsonFile = '/assets/app.config.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IEnvironment) => {
                AppConfigService.settings = response;
                console.log('Config Loaded');
                console.log(AppConfigService.settings);
                resolve();
            }).catch((response: any) => {
                reject('Could not load the config file');
            });
        });
    }
}
