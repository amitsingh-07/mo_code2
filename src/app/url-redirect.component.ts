import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-call-back',
  template: '<ng-template></ng-template>'
})
export class UrlRedirectComponent implements OnInit {

  data: any;
  constructor(
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.router.navigate([window.sessionStorage.getItem('currentUrl').substring(2)]);
  }
}
