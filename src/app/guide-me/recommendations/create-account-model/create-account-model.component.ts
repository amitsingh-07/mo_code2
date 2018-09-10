import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { GuideMeService } from '../../guide-me.service';

@Component({
  selector: 'app-create-account-model',
  templateUrl: './create-account-model.component.html',
  styleUrls: ['./create-account-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountModelComponent implements OnInit {
  @Input() data;
  constructor(public activeModal: NgbActiveModal,
              public signUpService: SignUpService,
              public guideMeService: GuideMeService,
              private router: Router) {
  }

  ngOnInit() {
  }

  next(page) {
    this.activeModal.close();
    if (page === 'signup') {
      this.signUpService.clearData();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    }
    if (page === 'login') {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    }
  }

}
