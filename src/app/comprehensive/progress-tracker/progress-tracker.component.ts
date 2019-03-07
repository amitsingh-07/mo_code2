import {
  Component,
  OnInit
} from '@angular/core';
import { IProgressTrackerData, IProgressTrackerItem } from './progress-tracker.types';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  public hideProgressTracker = false;
  private currentPageName = 'GetStartedComponent';
  private data: IProgressTrackerData;

  public onCloseClick(): void {
    this.hideProgressTracker = true;
  }
  constructor() {
    this.data = {
      title: 'Progress Tracker Title',
      subTitle: 'Time Taken: 20 mins',
      properties: {
        disabled: false
      },
      items: [{
        title: 'Get Started',
        expanded: true,
        completed: true,
        customStyle: 'get-started',
        subItems: [{
          pageName: 'GetStartedComponent1',
          title: 'Tell us about you',
          value: 'Vinoth',
          completed: true,
        }]
      }, {
        title: 'What\'s on your shoulders',
        expanded: false,
        completed: true,
        customStyle: 'dependant',
        subItems: [{
          pageName: 'DependantsComponent',
          title: 'Number of Dependant',
          value: '3',
          completed: true
        },
        {
          pageName: 'DependantsComponent',
          title: 'Plan for children education',
          value: 'Yes',
          completed: true
        },
        {
          pageName: 'DependantsComponent',
          title: 'Education Preferences',
          value: '',
          completed: true,
          list: [{
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
          pageName: 'DependantsComponent',
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
        subItems: [{
          pageName: 'GetStartedComponent',
          title: 'Your Earnings',
          value: '$38,000',
          completed: true,
        },
        {
          pageName: 'GetStartedComponent1',
          title: 'Your Spendings',
          value: '',
          completed: false,
        },
        {
          pageName: 'GetStartedComponent1',
          title: 'Bad Mood Fund',
          value: '',
          completed: false,
        },
        {
          pageName: 'GetStartedComponent1',
          title: 'Hospital Choice',
          value: '',
          completed: false,
        }
        ]
      }
      ]
    };
  }

  ngOnInit() { }

  public setCurrentPageName(pageName) {
    this.currentPageName = pageName;
  }

  public toggle(item: IProgressTrackerItem) {
    item.expanded = !item.expanded;
  }

  public setProgressTrackerData(data: IProgressTrackerData) {
    this.data = data;
  }
}
