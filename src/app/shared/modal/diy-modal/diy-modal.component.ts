import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-diy-modal',
  templateUrl: './diy-modal.component.html',
  styleUrls: ['./diy-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiyModalComponent implements OnInit {
  @Input() popupTitle: any;
  @Input() popupMessage: any;

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
