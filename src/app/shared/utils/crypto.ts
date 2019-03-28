import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AuthenticationService } from '../http/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private authService: AuthenticationService) { }

  encrypt(password: any) {
    const secret = this.authService.getSessionId();
    const encrypted = CryptoJS.AES.encrypt(password, secret);
    return encrypted.toString();
  }
}
