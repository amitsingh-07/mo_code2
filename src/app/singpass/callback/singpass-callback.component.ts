import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { LoginService } from '../../sign-up/login/login.service';

@Component({
  selector: 'app-singpass-callback',
  templateUrl: './singpass-callback.component.html',
  styleUrls: ['./singpass-callback.component.scss']
})
export class SingpassCallBackComponent implements OnInit {

  data: any;
  myInfoSubscription: any;
  constructor(
    private router: Router, private route: ActivatedRoute,
    public authService: AuthenticationService,
    private loginService: LoginService,
    private translate: TranslateService
    ) {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.route.queryParams.subscribe((qp) => {
        console.log('Get Router Params:', this.route.snapshot.queryParams);
        if (qp['code'] && qp['state']) {
          // Check if User is authenticated yet
          if (!this.authService.isAuthenticated()) {
            this.authService.authenticate().subscribe((token) => {
            });
          }
          console.log("CODE = "+ qp['code'] + "STATE = " + qp['state']);
          this.loginService.loginBySingpass(qp['code'], qp['state']);
        } else {
          this.router.navigate(['/accounts/login']);
        }
      });
    });
      
    }

  ngOnInit() {}
  
}
