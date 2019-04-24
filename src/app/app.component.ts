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
import { PopupModalComponent } from './shared/modal/popup-modal/popup-modal.component';
import { RoutingService } from './shared/Services/routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements IComponentCanDeactivate, OnInit, AfterViewInit {
  title = 'Money Owl';
  modalRef: NgbModalRef;
  initRoute = false;

  constructor(
    private log: LoggerService, private translate: TranslateService, private appService: AppService,
    private facebookPixelService: FBPixelService, private googleAnalyticsService: GoogleAnalyticsService,
    private modal: NgbModal, public route: Router, public routingService: RoutingService, private location: Location,
    private configService: ConfigService) {
    this.translate.setDefaultLang('en');
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
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
            this.triggerPopup();
          }
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

  triggerPopup() {
    this.modalRef = this.modal.open(PopupModalComponent, {
      centered: true,
      windowClass: 'popup-modal-dialog'
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (window.opener) {
      return true;
    }
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'Changes you made will not be saved. Do you want to continue?';
    }
  }
}
