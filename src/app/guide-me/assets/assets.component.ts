import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(private router: Router, public headerService: HeaderService) { 
    this.pageTitle = 'My Assets';
  }

  ngOnInit() {
    this.setPageTitle(this.pageTitle);
  }

  setPageTitle(title: string){
    this.headerService.setPageTitle(title);
  }
  
  goToNext(form) {
    this.router.navigate(['../guideme/liabilities']);
  }
}