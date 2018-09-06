import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '../../../portfolio/portfolio-routes.constants';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-model-with-button',
  templateUrl: './model-with-button.component.html',
  styleUrls: ['./model-with-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModelWithButtonComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  constructor(public activeModal: NgbActiveModal, private router: Router,public readonly translate: TranslateService) {
    this.translate.use('en');
   
    this.translate.get('COMMON').subscribe((result: string) => {
     
    });
   }


  ngOnInit() {
  }
  goNext() { 
    this.activeModal.dismiss('Cross click')
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT]);
   }
}
