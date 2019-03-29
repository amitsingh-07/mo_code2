import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() { }

  encrypt(value: any) {
    return sha512(value);
  }
}