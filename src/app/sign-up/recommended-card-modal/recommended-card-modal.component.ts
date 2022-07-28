import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Util } from '../../shared/utils/util';

@Component({
  selector: 'app-recommended-card-modal',
  templateUrl: './recommended-card-modal.component.html',
  styleUrls: ['./recommended-card-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendedCardModalComponent implements OnInit {

  @Input() cardContent: any;
  @Output() closeAction = new EventEmitter<any>();
  environments = ['https://bfa-uat3.ntucbfa.com/app', 'https://newmouat1.ntucbfa.com/app', 'https://bfa-dev2.ntucbfa.cloud/app', 'https://bfa-dev.ntucbfa.cloud/app', 'https://bfa-fb-newdev.ntucbfa.cloud/app', 'http://localhost:4300/app']
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  dismissCard(isDismiss) {
    if (isDismiss) {
      this.closeAction.emit();
    }
    this.activeModal.dismiss();
  }

  nextStep() {
    const redirectURL = this.cardContent ? this.cardContent.interactionButtonLink : '';
    let containingValue = '';
    const contains = this.environments.some(element => {
      if (redirectURL.includes(element)) {
        containingValue = element;
        return true;
      }    
      return false;
    });
    if (!Util.isEmptyOrNull(redirectURL) && contains) {
      const route = redirectURL.replace(containingValue, '..')
      console.log(route)
      this.router.navigate([route]);
      this.activeModal.dismiss();
    } else {
      // this.router.navigate([redirectURL]);
      window.open(redirectURL, "_blank");
      this.activeModal.dismiss();
    }
  }
}
