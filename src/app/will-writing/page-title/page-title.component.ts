import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageTitleComponent implements OnInit {
  @Input() pageTitle: any;
  @Input() step: any;
  @Input() tooltip: any;

  unsavedMsg: string;

  constructor(
    private _location: Location,
    private modal: NgbModal,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
    });
  }

  ngOnInit() {
  }

  goBack() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.unsavedMsg;
    ref.componentInstance.unSaved = true;
    ref.result.then((data) => {
      if (data === 'yes') {
        this._location.back();
      }
    });
    return false;
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
    this.willWritingService.openToolTipModal(title, message);
  }

}
