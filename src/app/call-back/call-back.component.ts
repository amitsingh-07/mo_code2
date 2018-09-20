import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me/guide-me-routes.constants';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { GuideMeService } from './../guide-me/guide-me.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {

  data: any;
  constructor(private router: Router, private route: ActivatedRoute, private modal: NgbModal,
              private guideMeService: GuideMeService ) { }

  ngOnInit() {
    if (this.route.url['value'][0].path === 'callback' ) {
    if (this.guideMeService.myInfoValue) {
      this.guideMeService.isMyInfoEnabled = false;
    } else {
      this.guideMeService.openFetchPopup();
      this.guideMeService.isMyInfoEnabled = true;
      this.data = this.route.url['value'][0].parameters.data;
      this.data = this.data.substr(this.data.indexOf('=') + 1, this.data.indexOf('&') - this.data.indexOf('=') - 1);
      this.guideMeService.setMyInfoValue(this.data);
      this.router.navigate([window.sessionStorage.getItem('currentUrl').substring(2)]);
    }
   }
  }
}
