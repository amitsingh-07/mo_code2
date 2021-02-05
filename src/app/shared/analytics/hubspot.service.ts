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

  registerPhone(mobile: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify",{
      mobile: mobile
    }]);
    console.log("Phone Registered in Hubspot" + mobile);
  }

  loginEvent() {
    console.log("Login Event Triggered");
    const currentDate = new Date();
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["trackEvent", {
      id: "Login Successful",
      value: currentDate.getTime()
    }]);
  }
}
