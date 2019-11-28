import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-redirect',
  templateUrl: './payment-redirect.component.html',
  styleUrls: ['./payment-redirect.component.scss']
})
export class PaymentRedirectComponent implements OnInit {

  data: any;
  myInfoSubscription: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('INSIDE REDIRECT COMPONENT!')
    window.opener.success('SUCCESS');
  }

}
