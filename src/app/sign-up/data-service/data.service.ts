import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { users } from "../models/users";

@Injectable({
  providedIn: 'root'
})

export class ApiService2{
  url: string = "/src/assets/mock-data/authenticate.json"
  constructor(private http:HttpClient){}

  getLoginInfo(): Observable<users[]>{
    return this.http.get<users[]>("assets/mock-data/authenticate.json");
  }
}
