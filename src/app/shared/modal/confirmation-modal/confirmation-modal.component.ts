import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  public onClose: Subject<boolean>;

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }
  public onConfirm(): void {
    this.onClose.next(true);
    this.activeModal.close();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.activeModal.close();
  }
}
