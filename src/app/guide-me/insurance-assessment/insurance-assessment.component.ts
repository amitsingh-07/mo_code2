import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-assessment',
  templateUrl: './insurance-assessment.component.html',
  styleUrls: ['./insurance-assessment.component.scss']
})
export class InsuranceAssessmentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goNext() {

  }
}
