import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetAllocationComponent implements OnInit {

  event1 = true;
  event2 = true;

  constructor() { }

  ngOnInit() {
  }

  // accordian
  test(event) {
    event === 'event1' ? this.event1 = !this.event1 : '';
    event === 'event2' ? this.event2 = !this.event2 : '';
  }

}
