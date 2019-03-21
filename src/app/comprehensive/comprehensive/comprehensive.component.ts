import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { APP_ROUTES } from '../../app-routes.constants';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import {
  LoginCreateAccountModelComponent
} from './../../shared/modal/login-create-account-model/login-create-account-model.component';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.scss']
})
export class ComprehensiveComponent implements OnInit {

  loginModalTitle: string;
  modalRef: NgbModalRef;
  safeURL: any;

  constructor(
    private appService: AppService, private cmpService: ComprehensiveService,
    private route: ActivatedRoute, private router: Router, public translate: TranslateService,
    public navbarService: NavbarService, private configService: ConfigService,
    private authService: AuthenticationService, public modal: NgbModal,
    public footerService: FooterService, private sanitizer: DomSanitizer) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        this.loginModalTitle = this.translate.instant('CMP.MODAL.LOGIN_SIGNUP_TITLE');
        this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.translate.instant('CMP.COMPREHENSIVE.VIDEO_LINK'));
      });
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(false);
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
  }
  start() {
    if (this.authService.isSignedUser()) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    } else {
      this.showLoginOrSignupModal();
    }
  }

  showLoginOrSignupModal() {
    this.cmpService.clearFormData();
    this.cmpService.setStartingPage(APP_ROUTES.COMPREHENSIVE);
    this.modalRef = this.modal.open(LoginCreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    // #this.modalRef.componentInstance.data = { redirectUrl: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED };
    this.modalRef.componentInstance.title = this.loginModalTitle;
  }
}
