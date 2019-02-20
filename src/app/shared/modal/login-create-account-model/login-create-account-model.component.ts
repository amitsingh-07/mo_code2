import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { LoaderService } from '../../components/loader/loader.service';

@Component({
  selector: 'app-login-create-account-model',
  templateUrl: './login-create-account-model.component.html',
  styleUrls: ['./login-create-account-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginCreateAccountModelComponent implements OnInit {
  @Input() data;
  @Input() title;

  constructor(
    public activeModal: NgbActiveModal,
    public signUpService: SignUpService, private loaderService: LoaderService,
    private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeModal.dismiss();
      }
    });
  }

  ngOnInit() {

  }

  next(page) {
    if (this.data && this.data.redirectUrl) {
      this.signUpService.setRedirectUrl(this.data.redirectUrl);
    }
    this.loaderService.showLoader({
      title: 'Loading',
      desc: ''
    });
    this.activeModal.close();
    if (page === 'signup') {
      this.signUpService.clearData();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT], { skipLocationChange: true });
    }
    if (page === 'login') {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN], { skipLocationChange: true });
    }
  }

  close() {
    this.signUpService.clearRedirectUrl();
    this.activeModal.dismiss();
  }
}
