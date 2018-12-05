import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-recommendations-modal',
  templateUrl: './recommendations-modal.component.html',
  styleUrls: ['./recommendations-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecommendationsModalComponent implements OnInit {
  @Input() title: any;
  @Input() message: any;

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
