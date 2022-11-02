import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';

import { ModelWithButtonComponent } from '../shared/modal/model-with-button/model-with-button.component';
import { SingpassService } from './singpass.service';
@Component({
  selector: 'app-singpass',
  templateUrl: './singpass.component.html',
  styleUrls: ['./singpass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingPassComponent implements OnInit {
  @Input() showSingpassLogin: boolean;
  loginUrl: Observable<any>;
  
  constructor(
    public translate: TranslateService,
    private modal: NgbModal,
    private singpassService: SingpassService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.singpassService.getStateNonce();
  }

  openSingpassModal(event) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true,  windowClass: 'open-singpass-modal'});
    ref.componentInstance.errorTitle = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.TITLE');
    ref.componentInstance.errorMessageHTML = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.MESSAGE');
    ref.componentInstance.primaryActionLabel = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.BTN_TXT');
    event.stopPropagation();
    event.preventDefault();
  }

  openSingpassLogin(){
    this.singpassService.openSingpassUrl();
  }

}
