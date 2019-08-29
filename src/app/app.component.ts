import { Location } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';

import { AppService } from './app.service';
import { IComponentCanDeactivate } from './changes.guard';
import { ConfigService, IConfig } from './config/config.service';
import { FBPixelService } from './shared/analytics/fb-pixel.service';
import { GoogleAnalyticsService } from './shared/analytics/google-analytics.service';
import { LoggerService } from './shared/logger/logger.service';
import { DiyModalComponent } from './shared/modal/diy-modal/diy-modal.component';
import { PopupModalComponent } from './shared/modal/popup-modal/popup-modal.component';
import { TermsModalComponent } from './shared/modal/terms-modal/terms-modal.component';
import { INavbarConfig } from './shared/navbar/config/navbar.config.interface';
import { NavbarConfig } from './shared/navbar/config/presets';
import { NavbarService } from './shared/navbar/navbar.service';
import { RoutingService } from './shared/Services/routing.service';
import { SignUpService } from './sign-up/sign-up.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements IComponentCanDeactivate, OnInit, AfterViewInit {
  title = 'Money Owl';
  modalRef: NgbModalRef;
  initRoute = false;
  redirect = '';
  navbarMode = null;

  constructor(
    private log: LoggerService, private translate: TranslateService, private appService: AppService,
    private signUpService: SignUpService, private navbarService: NavbarService, private _location: Location,
    private facebookPixelService: FBPixelService, private googleAnalyticsService: GoogleAnalyticsService,
    private modal: NgbModal, public route: Router, public routingService: RoutingService, private location: Location,
    private configService: ConfigService) {
    this.translate.setDefaultLang('en');
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      if (config.distribution) {
        if (config.distribution.notice) {
          if (config.distribution.notice.onLoad) {
            this.redirect = config.distribution.notice.fail;
            if (this.location.path().indexOf('/accounts/email-verification') === -1 ||
                this.location.path().indexOf('/accounts/reset-password')
              ) {
              this.openTermsOfConditions();
              }
            }
          }
        }
    });
    // Check NavbarMode
    this.navbarService.currentNavbarMode.subscribe((navbarMode) => {
      this.navbarMode = navbarMode;
    });
  }

  ngOnInit() {
    window.myinfo = window.myinfo || {};
    window.myinfo.namespace = window.myinfo.namespace || {};
    window.failed = window.failed || {};
    window.failed.namespace = window.failed.namespace || {};
    window.success = window.success || {};
    window.success.namespace = window.success.namespace || {};
  }

  ngAfterViewInit() {
    this.route.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {// Redirected out
        if (!this.initRoute) {
          if (val.url === '/home#diy') {
            this.triggerDiyPopup();
          }
          /*
          else {
            this.triggerPopup();
          }*/
          this.initRoute = true;
        } else {
          if (this.modalRef) {
            this.modalRef.close();
          }
        }
    }
    });
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  triggerDiyPopup() {
    this.modalRef = this.modal.open(DiyModalComponent, {
      centered: true,
      windowClass: 'popup-modal-dialog modal-animated'
    });
  }

  triggerPopup() {
    this.modalRef = this.modal.open(PopupModalComponent, {
      centered: true,
      windowClass: 'popup-modal-dialog modal-animated',
    });
  }

  openTermsOfConditions() {
    if (localStorage.getItem('onInit') !== 'true') {
      const ref = this.modal.open(TermsModalComponent, { centered: true, windowClass: 'sign-up-terms-modal-dialog', backdrop: 'static'});
      ref.result.then((data) => {
      if (data !== 'proceed') {
        if (this.redirect === '' || this.redirect === undefined) {
          this._location.back();
        } else {
          window.location.href = this.redirect;
          }
        } else {
        localStorage.setItem('onInit', 'true');
        }
      });
      }
    }

  checkExit() {
    const matrix = new NavbarConfig();
    let nc: INavbarConfig;
    if (this.navbarMode ? true : false && (this.navbarMode !== 'default')) {
      nc = matrix[this.navbarMode];
    } else {
      nc = matrix['default'] as INavbarConfig;
    }
    if (nc.showExitCheck) {
      return nc.showExitCheck;
    } else {
      return false;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.checkExit()) {
      if (window.opener) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'Changes you made will not be saved. Do you want to continue?';
    }
  }
}
