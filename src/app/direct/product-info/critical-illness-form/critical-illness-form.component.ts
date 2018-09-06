import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-critical-illness-form',
  templateUrl: './critical-illness-form.component.html',
  styleUrls: ['./critical-illness-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CriticalIllnessFormComponent implements OnInit {

  constructor( private directService: DirectService) { }

  ngOnInit() {
    this.directService.setProdCategoryIndex(1);
  }

}
