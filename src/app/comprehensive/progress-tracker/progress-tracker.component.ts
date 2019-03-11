import { ComprehensiveService } from './../comprehensive.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { COMPREHENSIVE_ROUTE_PATHS } from './../comprehensive-routes.constants';
import { IProgressTrackerData, IProgressTrackerItem } from './progress-tracker.types';

@Component({
    selector: 'app-progress-tracker',
    templateUrl: './progress-tracker.component.html',
    styleUrls: [ './progress-tracker.component.scss' ]
})
export class ProgressTrackerComponent implements OnInit {
    public hideProgressTracker = false;
    private currentPageName = 'GetStartedComponent';
    private data: IProgressTrackerData;
    pathRegex = /../;

    public onCloseClick(): void {
        this.hideProgressTracker = true;
    }
    constructor(private router: Router, private cmpService: ComprehensiveService) {
        this.data = this.cmpService.generateProgressTrackerData();
    }

    ngOnInit() {}

    public setCurrentPageName(pageName: string) {
        this.currentPageName = pageName;
    }

    public toggle(item: IProgressTrackerItem) {
        item.expanded = !item.expanded;
    }

    public setProgressTrackerData(data: IProgressTrackerData) {
        this.data = data;
    }

    navigate(path: string): void {
        this.router.navigate([ path ]);
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
