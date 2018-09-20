import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  @Input('count') count;
  @Input('activeStepIndex') activeStepIndex;

  constructor() { }

  ngOnInit() {
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}
