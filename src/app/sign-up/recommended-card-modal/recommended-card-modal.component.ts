import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
  environments = Util.getMOEnvironments();
  constructor(
    private readonly translate: TranslateService,
    public activeModal: NgbActiveModal,
    private router: Router
  ) {
    this.translate.use('en');
  }

  ngOnInit(): void {
  }

  dismissCard(isDismiss) {
    this.closeAction.emit(isDismiss);
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
      window.open(redirectURL, "_blank");
      this.activeModal.dismiss();
    }
  }
}
