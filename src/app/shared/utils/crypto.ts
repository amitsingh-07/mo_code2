import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { sha512 } from 'js-sha512';
import { AuthenticationService } from '../http/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private authService: AuthenticationService) { }

  encrypt(pwd: any) {
    const secret = this.authService.getSessionId();
    const password = sha512(pwd);
    let encrypted = CryptoJS.AES.encrypt(password, secret);
    return encrypted.toString();
  }
}
