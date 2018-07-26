import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-assessment',
  templateUrl: './financial-assessment.component.html',
  styleUrls: ['./financial-assessment.component.scss']
})
export class FinancialAssessmentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToIncome() {
    this.router.navigate(['../guideme/income']);
  }
}
