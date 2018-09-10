import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-critical-illness-form',
  templateUrl: './critical-illness-form.component.html',
  styleUrls: ['./critical-illness-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CriticalIllnessFormComponent implements OnInit, OnDestroy {
  categorySub: any;

  constructor( private directService: DirectService) { }

  ngOnInit() {
    this.directService.setProdCategoryIndex(1);
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        console.log('Search Button Triggered Critical Illness');
        this.directService.triggerSearch('');
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
}
