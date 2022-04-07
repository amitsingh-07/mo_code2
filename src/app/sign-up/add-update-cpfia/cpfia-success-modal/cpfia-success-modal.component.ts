import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cpfia-success-modal',
  templateUrl: './cpfia-success-modal.component.html',
  styleUrls: ['./cpfia-success-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfiaSuccessModalComponent implements OnInit {
  @Input() banks;
  @Input() fullName;
  @Input() bankDetails;
  @Input() errorTitle;
  @Input() errorMessage;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() topUp: EventEmitter<any> = new EventEmitter();
  @Output() resendEmail: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
      // dismiss all bootstrap modal dialog
      this.activeModal.dismiss();
    });
  }
  goBack() {
    this.selected.emit();
    this.activeModal.close();
  }
  goToTopUp() {
    this.topUp.emit();
    this.activeModal.close();
  }
}
