import { Observable } from 'rxjs/Observable';
import { Component, HostListener } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { IComponentCanDeactivate } from './changes.guard';
import { GoogleAnalyticsService } from './shared/ga/google-analytics.service';
import { LoggerService } from './shared/logger/logger.service';
import { PopupModalComponent } from './shared/modal/popup-modal/popup-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements IComponentCanDeactivate {
  title = 'Money Owl';
  modalRef: NgbModalRef;

  constructor(
    private log: LoggerService, private translate: TranslateService,
    private googleAnalyticsService: GoogleAnalyticsService, private modal: NgbModal) {
    this.translate.setDefaultLang('en');
    this.triggerPopup();
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  triggerPopup() {
    this.modalRef = this.modal.open(PopupModalComponent, { centered: true, windowClass: 'popup-modal-dialog' });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }
}
