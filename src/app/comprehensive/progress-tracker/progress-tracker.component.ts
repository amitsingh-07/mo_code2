import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  public showProgressTracker = true;
  getstrdExpanded = true;
  getshldrExpanded = true;
  getfinanceExpanded = true;
  public onCloseClick():void {
    this.showProgressTracker = false;
  }
  constructor() { }

  ngOnInit() {
  }

}
