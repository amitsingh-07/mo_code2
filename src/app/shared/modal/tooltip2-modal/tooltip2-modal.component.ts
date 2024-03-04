import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tooltip-modal',
  templateUrl: './tooltip2-modal.component.html',
  styleUrls: ['./tooltip2-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolTip2ModalComponent implements OnInit {
  @Input() tooltipTitle: any;
  @Input() tooltipMessage: any;

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

}

