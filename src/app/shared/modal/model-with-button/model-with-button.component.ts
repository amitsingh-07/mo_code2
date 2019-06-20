import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  @Input() imgType = 1;
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() errorMessageHTML: any;
  @Input() primaryActionLabel: any;
  @Input() secondaryActionLabel: any;
  @Input() yesOrNoButton: any;
  @Input() warningIcon: any;
  @Input() secondaryActionDim: boolean;
  @Input() isInlineButton: boolean;
  @Output() primaryAction = new EventEmitter<any>();
  @Output() secondaryAction = new EventEmitter<any>();
  @Output() yesClickAction = new EventEmitter<any>();
  @Output() noClickAction = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
                // dismiss all bootstrap modal dialog
                this.activeModal.dismiss();
            });
  }

  primaryActionSelected() {
    this.primaryAction.emit();
    this.activeModal.close();
  }

  secondaryActionSelected() {
    this.secondaryAction.emit();
    this.activeModal.close();
  }

  yesButtonClick() {
    this.yesClickAction.emit();
    this.activeModal.close();
  }

  noButtonClick() {
    this.noClickAction.emit();
    this.activeModal.close();
  }

}
