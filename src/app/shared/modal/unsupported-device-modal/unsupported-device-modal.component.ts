import { filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
    ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../../engagement-journey/engagement-journey-routes.constants';
import {
    RecommendationComponent
} from '../../../engagement-journey/recommendation/recommendation.component';

@Component({
  selector: 'app-unsupported-device-modal',
  templateUrl: './unsupported-device-modal.component.html',
  styleUrls: ['./unsupported-device-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnsupportedDeviceModalComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() errorMessageHTML: any;

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
                //this.activeModal.dismiss();
            });
  }

}
