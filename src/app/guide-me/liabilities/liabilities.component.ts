import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})
export class LiabilitiesComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(private router: Router, public headerService: HeaderService) {
    this.pageTitle = 'My Liabilities';
  }

  ngOnInit() {
    this.setPageTitle(this.pageTitle);
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  goToNext() {
    this.router.navigate(['../guideme/assuranceassessment']);
  }
}
