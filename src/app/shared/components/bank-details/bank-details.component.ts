import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankDetailsComponent implements OnInit {

  @Input('bankDetails') bankDetails;
  constructor() { }

  ngOnInit(): void {
  }

  editWithdrawDetails() {
    
  }
}
