import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class GuideMeApiService {
    constructor(
        private http: HttpClient, private apiService: ApiService,
        private authService: AuthenticationService) {
    }
}
