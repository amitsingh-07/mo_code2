import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-edit-mobile-number',
  templateUrl: './edit-mobile-number.component.html',
  styleUrls: ['./edit-mobile-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditMobileNumberComponent implements OnInit {

  @Output() updateMobileNumber: EventEmitter<any> = new EventEmitter()

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

  updateMobileNo(mobileNumber: number) {
    this.updateMobileNumber.emit(mobileNumber);
  }
}
