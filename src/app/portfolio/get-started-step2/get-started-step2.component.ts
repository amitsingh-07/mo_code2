import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-started-step2',
  templateUrl: './get-started-step2.component.html',
  styleUrls: ['./get-started-step2.component.scss']
})
export class GetStartedStep2Component implements OnInit {
  title="Step 2";
  description="Assess Your Risk";
    img ="assets/images/step-2-icon.svg";
    description2="In the next step,we will assess your willingness to take risk";
    tab="2";
  constructor() { }

  ngOnInit() {
  }

}
