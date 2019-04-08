import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';

import { ProgressTrackerModalComponent } from './progress-tracker-modal.component';
import { ProgressTrackerUtil } from './progress-tracker-util';
import { IProgressTrackerData } from './progress-tracker.types';

@Injectable({
    providedIn: 'root'
})
export class ProgressTrackerService {
    isModalOpen = false;
    private data: IProgressTrackerData;
    private subject: BehaviorSubject<IProgressTrackerData> = new BehaviorSubject<
        IProgressTrackerData
    >({} as IProgressTrackerData);
    private changeListener = new Subject();
    private modelRef: NgbModalRef;

    constructor(private modal: NgbModal, private router: Router) { }

    public show() {
        if (!this.isModalOpen) {
            this.refresh();
            this.modelRef = this.modal.open(ProgressTrackerModalComponent, {
                windowClass: 'progress-tracker-modal',
                backdropClass: 'progress-tracker-backdrop'
            });
            this.isModalOpen = true;
        } else {
            this.hide();
        }
    }

    public hide() {
        if (this.modelRef) {
            this.modelRef.close();
            this.isModalOpen = false;
        }
    }

    public setProgressTrackerData(data: IProgressTrackerData) {
        this.data = data;
        this.subject.next(this.data);
    }

    public getProgressTrackerData() {
        return this.subject.asObservable();
    }

    public updateValue(path: string, value: any): void {
        this.data.items.forEach((item) => {
            item.subItems.forEach((subItem) => {
                if (ProgressTrackerUtil.compare(path, subItem.path)) {
                    subItem.value = value;
                    subItem.completed = true;
                }
            });
        });
        this.subject.next(this.data);
    }

    public updateList(path: string, list: any): void {
        this.data.items.forEach((item) => {
            item.subItems.forEach((subItem) => {
                if (ProgressTrackerUtil.compare(path, subItem.path)) {
                    subItem.list = list;
                    subItem.completed = true;
                }
            });
        });
        this.subject.next(this.data);
    }

    /**
     * Refresh the progress tracker UI.
     *
     * @memberof ProgressTrackerService
     */
    refresh(): void {
        this.subject.next(this.data);
    }

    navigate(path: string): void {
        this.router.navigate([path]);
    }
}

/* #{
            title: 'Progress Tracker Title',
            subTitle: 'Time Taken: 20 mins',
            properties: {
                disabled: false
            },
            items: [
                {
                    title: 'Get Started',
                    expanded: true,
                    completed: true,
                    customStyle: 'get-started',
                    subItems: [
                        {
                            path: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
                            title: 'Tell us about you',
                            value: 'Vinoth',
                            completed: true
                        }
                    ]
                },
                {
                    title: "What's on your shoulders",
                    expanded: true,
                    completed: true,
                    customStyle: 'dependant',
                    subItems: [
                        {
                            path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
                            title: 'Number of Dependant',
                            value: '3',
                            completed: true
                        },
                        {
                            path: 'DependantsComponent',
                            title: 'Plan for children education',
                            value: 'Yes',
                            completed: true
                        },
                        {
                            path: 'DependantsComponent',
                            title: 'Education Preferences',
                            value: '',
                            completed: true,
                            list: [
                                {
                                    title: 'Nathan',
                                    value: 'Medicine'
                                },
                                {
                                    title: 'Raj',
                                    value: 'Overseas, Non-Medicine'
                                }
                            ]
                        },
                        {
                            path: 'DependantsComponent',
                            title: 'Do you have education endowment plan',
                            value: 'Yes',
                            completed: true
                        }
                    ]
                },
                {
                    title: 'Your Finances',
                    expanded: true,
                    completed: false,
                    customStyle: 'get-started',
                    subItems: [
                        {
                            path: 'GetStartedComponent',
                            title: 'Your Earnings',
                            value: '$38,000',
                            completed: true
                        },
                        {
                            path: 'GetStartedComponent1',
                            title: 'Your Spendings',
                            value: '',
                            completed: false
                        },
                        {
                            path: 'GetStartedComponent1',
                            title: 'Bad Mood Fund',
                            value: '',
                            completed: false
                        },
                        {
                            path: 'GetStartedComponent1',
                            title: 'Hospital Choice',
                            value: '',
                            completed: false
                        }
                    ]
                }
            ]
        };
        */
