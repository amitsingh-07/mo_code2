import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-topup-request',
  templateUrl: './topup-request.component.html',
  styleUrls: ['./topup-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopupRequestComponent implements OnInit {
  status;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public topupAndWithDrawService: TopupAndWithDrawService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.status = params['status'];
      console.log(this.status);
    });
  }
  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
}
