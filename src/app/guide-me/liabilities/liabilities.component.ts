import { Component, OnInit } from '@angular/core';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';

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

  setPageTitle(title: string){
    this.headerService.setPageTitle(title);
  }
}
