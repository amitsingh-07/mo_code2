import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProgressTrackerService } from './progress-tracker.service';
import { IProgressTrackerData, IProgressTrackerItem, IProgressTrackerSubItem } from './progress-tracker.types';
import { ComprehensiveService } from '../../../comprehensive/comprehensive.service';
import { COMPREHENSIVE_CONST } from 'src/app/comprehensive/comprehensive-config.constants';
@Component({
    selector: 'app-progress-tracker',
    templateUrl: './progress-tracker.component.html',
    styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
    data: IProgressTrackerData;

    currentPath = '';
    pathRegex = /../;

    constructor(
        private progressService: ProgressTrackerService,
        private route: Router,
        private comprehensiveService: ComprehensiveService
    ) {
        this.currentPath = this.route.url;
        this.progressService.getProgressTrackerData().subscribe((progressData) => {
            if (progressData) {
                this.data = progressData;
            } else {
                this.data = {} as IProgressTrackerData;
            }
        });
    }

    ngOnInit() { }

    /**
     * Close the progress tracker popup.
     *
     * @memberof ProgressTrackerComponent
     */
    public onCloseClick(): void {
        this.progressService.hide();
    }

    /**
     * Toggle the accordion item state: `expanded = true | false`
     *
     * @param {IProgressTrackerItem} item
     * @memberof ProgressTrackerComponent
     */
    public toggle(item: IProgressTrackerItem) {
        item.expanded = !item.expanded;
    }

    /**
     * Navigate to the selected component if the item is completed.
     *
     * @param {IProgressTrackerSubItem} subItem
     * @memberof ProgressTrackerComponent
     */
    public navigate(subItem: IProgressTrackerSubItem) {
        if (subItem.completed && !this.data.properties.readOnly) {
            this.progressService.hide();
            this.progressService.navigate(subItem.path);
        }
    }

    /**
    * Navigate to the selected component or toggle the accordion.
    */
    public navigateOrToggle(item) {
        if (item.title == COMPREHENSIVE_CONST.REVIEW_INPUTS && this.comprehensiveService.checkResultData() 
            && this.comprehensiveService.getMySteps() == 4) {
            this.progressService.hide();
            this.progressService.navigate(item.path);
        } else if (item.title != COMPREHENSIVE_CONST.REVIEW_INPUTS) {
            this.toggle(item);
        }
    }
}
