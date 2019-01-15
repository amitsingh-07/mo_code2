import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insure-link',
  templateUrl: './insure-link.component.html',
  styleUrls: ['./insure-link.component.scss']
})
export class InsureLinkComponent implements OnInit {

  constructor( private translate: TranslateService) { }

  ngOnInit() {
    this.translate.use('en');
  }

}
