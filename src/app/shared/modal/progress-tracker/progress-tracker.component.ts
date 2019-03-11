import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { ProgressTrackerService } from './progress-tracker.service';
import { IProgressTrackerData, IProgressTrackerItem } from './progress-tracker.types';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-progress-tracker',
    templateUrl: './progress-tracker.component.html',
    styleUrls: [ './progress-tracker.component.scss' ]
})
export class ProgressTrackerComponent implements OnInit {
    private data: IProgressTrackerData;
    private subscription: Subscription;

    currentPath = '';
    pathRegex = /../;

    public onCloseClick(): void {
        this.activeModal.dismiss();
    }
    constructor(
        private progressService: ProgressTrackerService,
        private activeModal: NgbActiveModal,
        private route: Router
    ) {
        this.currentPath = this.route.url;
        this.subscription = this.progressService.getProgressTrackerData().subscribe((progressData) => {
            if (progressData) {
                this.data = progressData;
            } else {
                this.data = {} as IProgressTrackerData;
            }
        });
    }

    ngOnInit() {}

    public toggle(item: IProgressTrackerItem) {
        item.expanded = !item.expanded;
    }
}
