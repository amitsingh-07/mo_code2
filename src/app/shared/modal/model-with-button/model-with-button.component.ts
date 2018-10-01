import { Component, EventEmitter, Input, OnInit,  Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_ROUTE_PATHS } from '../../../portfolio/portfolio-routes.constants';
import { RiskProfileComponent } from '../../../portfolio/risk-profile/risk-profile.component';
@Component({
  selector: 'app-model-with-button',
  templateUrl: './model-with-button.component.html',
  styleUrls: ['./model-with-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModelWithButtonComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() ButtonTitle: any;
  @Input() ButtonNavigation: any;
  @Input() secondButton: any;
  @Input() secondButtonTitle: any;
  @Output() yesButtonClick = new EventEmitter<any>();

  @Input() errorMessageHTML: any;
  @Input() primaryActionLabel: any;
  @Input() secondaryActionLabel: any;
  @Output() primaryAction =  new EventEmitter<any>();
  @Output() secondaryAction = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
   }

  ngOnInit() {
  }
  modelButtonClick() {
      if (this.secondButton) {
        this.yesButtonClick.emit('Yes');
      }
      this.activeModal.dismiss('Cross click');
      this.router.navigate([this.ButtonNavigation]);
    }
    // tslint:disable-next-line:no-identical-functions
    secondmodelButtonClick() {
      if (this.secondButton) {
        this.yesButtonClick.emit('No');
      }
      this.activeModal.dismiss('Cross click');
      this.router.navigate([this.ButtonNavigation]);
    }

    primaryActionSelected() {
      this.primaryAction.emit();
      this.activeModal.dismiss('Cross click');
    }

    secondaryActionSelected() {
      this.secondaryAction.emit();
      this.activeModal.dismiss('Cross click');
    }

  }
