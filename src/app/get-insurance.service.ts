import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { observable, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GetInsuranceService {
  public url:string="http://localhost:4200/assets/insurance.json"
  constructor(private http:HttpClient) { }
  getInsurance():Observable<any>{
    return this.http.get<any>(this.url).pipe(
    catchError(this.errorHandler));
  }
  errorHandler(error:HttpErrorResponse)
  {
    return throwError(error.message || "Server error");
    
  }

}
