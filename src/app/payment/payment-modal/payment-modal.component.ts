import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentModalComponent implements OnInit {
  @Input() popupTitle: any;
  @Input() popupMessage: any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
    //     // dismiss all bootstrap modal dialog
    //     this.activeModal.dismiss();
    //   });
  }
  // closePopup() {
  //   this.activeModal.dismiss();
  // }

}
