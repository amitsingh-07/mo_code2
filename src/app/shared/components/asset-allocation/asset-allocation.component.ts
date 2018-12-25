import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetAllocationComponent implements OnInit {
  @Input('assets') assets;
  @Input('colors') colors;

  event1 = true;
  event2 = true;

  constructor() { }

  ngOnInit() {
    console.log(this.colors);
  }

  // accordian
  test(event) {
    event === 'event1' ? this.event1 = !this.event1 : '';
    event === 'event2' ? this.event2 = !this.event2 : '';
  }

}
