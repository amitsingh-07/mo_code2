import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None;
})
export class TermsComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {
    this.translate.use('en');
  }
  ngOnInit() {
  }

}
