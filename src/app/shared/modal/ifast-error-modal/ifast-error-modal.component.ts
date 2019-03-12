import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ifast-error-modal',
  templateUrl: './ifast-error-modal.component.html',
  styleUrls: ['./ifast-error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IfastErrorModalComponent implements OnInit {
  @Input() errorTitle: string;
  @Input() errorMessage: string;
  @Input() errorList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {});
  }

  ngOnInit() {}
}
