import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { IProductCategory } from '../direct/product-info/product-category/product-category';
import { HospitalPlan } from '../guide-me/hospital-plan/hospital-plan';

export interface IConfig {
  language: string;
  useMyInfo: boolean;
  maintenanceEnabled: boolean;
  marqueeEnabled: boolean;
  promotionEnabled: boolean;
  articleEnabled: boolean;
  willWritingEnabled: boolean;
  investmentEnabled: boolean;
  investmentEngagementEnabled: boolean;
  investmentMyInfoEnabled: boolean;
  comprehensiveEnabled: boolean;
  retirementPlanningEnabled: boolean;
  srsEnabled: boolean;
  resetPasswordUrl: string;
  verifyEmailUrl: string;
  hospitalPlanData: HospitalPlan[];
  productCategory: IProductCategory[];
  distribution: any;
}

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private cache$: Observable <IConfig> = null;
  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  getConfig() {
    if (!this.cache$) {
      this.cache$ = this.readConfig().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cache$;
  }

  private readConfig() {
    return this.http.get<IConfig>(this.configUrl).pipe(
      map((response) => response),
      catchError(this.handleError) // then handle the error
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
