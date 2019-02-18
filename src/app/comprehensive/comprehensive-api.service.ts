import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';
@Injectable({
  providedIn: 'root'
})
export class ComprehensiveApiService {

  constructor(private apiService: ApiService) { }

  getPersonalDetails() {
return this.apiService.getPersonalDetails();
  }
}
