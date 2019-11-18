import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-progress-tracker-modal',
    template: '<div><app-progress-tracker></app-progress-tracker></div>',
    styleUrls: [ './progress-tracker.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ProgressTrackerModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal, private router: Router) {}

    ngOnInit() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
                // dismiss all bootstrap modal dialog
                this.activeModal.dismiss();
            });
    }
}
