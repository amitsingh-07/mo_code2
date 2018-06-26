import { Component, OnInit } from '@angular/core';
import { GetInsuranceService } from '../get-insurance.service';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {
  public insurances=[];
  public errorMsg;
  constructor(private getInsuranceDetails:GetInsuranceService) { }

  ngOnInit() {
    this.getInsuranceDetails.getInsurance().subscribe(data => this.insurances=data,
                                                       error => this.errorMsg = error );
  }

}
