import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { HeaderService } from '../../shared/header/header.service';

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
  constructor(public headerService: HeaderService, private router: Router) { }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
  }

  goNext() { 
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT]);
  }

}
