import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { appConstants } from './../app.constants';
import { GuideMeService } from './../guide-me/guide-me.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {

  data: any;
  constructor(
    private router: Router, private route: ActivatedRoute, private modal: NgbModal,
    private guideMeService: GuideMeService) { }

  ngOnInit() {
    if (window.sessionStorage.currentUrl && this.route.queryParams['value'] && this.route.queryParams['value']['code']) {
      if (this.guideMeService.myInfoValue) {
        this.guideMeService.isMyInfoEnabled = false;
      } else {
        this.guideMeService.openFetchPopup();
        this.guideMeService.isMyInfoEnabled = true;
        this.data = this.route.queryParams['value'];
        this.guideMeService.setMyInfoValue(this.data);
        this.router.navigate([window.sessionStorage.getItem('currentUrl').substring(2)]);
      }
    } else {
      this.router.navigate(['home']);
    }

  }
}
