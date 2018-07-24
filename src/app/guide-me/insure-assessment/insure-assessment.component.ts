import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insure-assessment',
  templateUrl: './insure-assessment.component.html',
  styleUrls: ['./insure-assessment.component.scss']
})
export class InsureAssessmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  goNext() {
    console.log('Next Page');
  }
}
