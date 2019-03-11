import { Location } from '@angular/common';
import { Component, EventEmitter , Input, OnInit, Output , ViewEncapsulation} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-top-bar-with-clear-button',
  templateUrl: './top-bar-with-clear-button.component.html',
  styleUrls: ['./top-bar-with-clear-button.component.scss']
})
export class TopBarWithClearButtonComponent implements OnInit {

  @Input() pageTitle: any;
  @Input() step: any;
  @Input() tooltip: any;
  @Input() unsaved: boolean;
  @Output() clearAll = new EventEmitter<any>();
  unsavedMsg: string;

  constructor(
    private _location: Location,
    private modal: NgbModal,
    private translate: TranslateService
  ) {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
    });
  }

  ngOnInit() {
  }

  goBack() {
    if (this.unsaved) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.unsavedMsg;
      ref.componentInstance.unSaved = true;
      ref.result.then((data) => {
        if (data === 'yes') {
          this._location.back();
        }
      });
    } else {
      this._location.back();
    }
    return false;
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
  }
  clearAllSelected() {
    console.log ('going to emit');
    this.clearAll.emit();
  }

}
