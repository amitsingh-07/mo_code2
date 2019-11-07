import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationComponent implements OnInit {

  constructor(
    public navbarService: NavbarService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(2);
  }

  redirectTo() {
    this.router.navigate(['/home']);
  }

}
