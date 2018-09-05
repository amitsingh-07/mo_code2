import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HostListener } from '@angular/core';

@Component({
  selector: 'app-account-created',
  templateUrl: './account-created.component.html',
  styleUrls: ['./account-created.component.scss']
})
export class AccountCreatedComponent implements OnInit {

  constructor(private translate: TranslateService,
              private router: Router) {
    this.translate.use('en');
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
