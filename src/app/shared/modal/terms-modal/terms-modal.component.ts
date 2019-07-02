import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../footer/footer.service';
import { NavbarService } from '../../navbar/navbar.service';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TermsModalComponent implements OnInit {

  constructor(public navbarService: NavbarService, public footerService: FooterService,
      public activeModal: NgbActiveModal, private translate: TranslateService) {
        this.translate.use('en');
        }

  ngOnInit() {
  }

  close() {
    this.activeModal.close('proceed');
  }
}
