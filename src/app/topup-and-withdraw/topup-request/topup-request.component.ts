import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
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
