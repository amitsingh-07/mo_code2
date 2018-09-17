import { Component, Input, OnInit, ViewEncapsulation, Output,EventEmitter } from '@angular/core';
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
  @Input() forgotPassword: any;
  @Input() ButtonTitle: any;
  @Input() ButtonNavigation:any;
 @Output() selectNationalityError = new EventEmitter();

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

  goNext() {
    this.activeModal.dismiss('Cross click');
    this.router.navigate([this.ButtonNavigation]);
    }
    selectNationalityHomepage() {
      this.activeModal.dismiss('Cross click');
     this.selectNationalityError.emit();
    }
  }
