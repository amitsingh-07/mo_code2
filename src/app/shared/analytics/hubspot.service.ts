import { Injectable } from '@angular/core';

declare global {
  interface Window { _hsq: any; }
}

@Injectable({
  providedIn: 'root'
})
export class HubspotService {

  constructor() { }

  
  registerEmail(email: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify",{
      email: email
    }]);
    console.log("Email Registered in Hubspot" + email);
  }
}
