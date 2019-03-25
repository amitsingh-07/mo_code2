import { Component, Input, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {

  static STEPPER_MODE = {
    FILL_CURRENT: 0,
    FILL_PREVIOUS: 1
  };

  @Input('count') count;
  @Input('activeStepIndex') activeStepIndex;
  @Input('mode') mode?: number;

  constructor() {
    if (!this.mode) {
      this.mode = StepIndicatorComponent.STEPPER_MODE.FILL_CURRENT;
    }
  }

  ngOnInit() {
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

}
