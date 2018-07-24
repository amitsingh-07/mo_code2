import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fin-assessment',
  templateUrl: './fin-assessment.component.html',
  styleUrls: ['./fin-assessment.component.scss']
})
export class FinAssessmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  goNext() {
    console.log('Proceed Button Triggered');
  }
}
