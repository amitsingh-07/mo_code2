import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { TopUpAndWithdrawFormData } from './topup-and-withdraw-form-data';

const SESSION_STORAGE_KEY = 'app_inv_account_session';
@Injectable({
  providedIn: 'root'
})

export class TopupAndWithDrawService {
  constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
    this.getTopupInvestmentList();
  }
  getTopupInvestmentList() {
    return this.apiService.getTopupInvestmentList();
  }
}
