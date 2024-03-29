import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-creation-error-modal',
  templateUrl: './account-creation-error-modal.component.html',
  styleUrls: ['./account-creation-error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountCreationErrorModalComponent implements OnInit {
  @Input() errorTitle: string;
  @Input() errorMessage: string;
  @Input() errorList: any;

  constructor(
    public activeModal: NgbActiveModal,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() { }
}
