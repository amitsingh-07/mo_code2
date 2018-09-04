import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-breakdown-accordion',
  templateUrl: './breakdown-accordion.component.html',
  styleUrls: ['./breakdown-accordion.component.scss']
})
export class BreakdownAccordionComponent implements OnInit {

  @Input('allocation') allocation;
  @Input('activeIndex') activeIndex;
  @Input('colors') colors;

  @Output() selectAllocationAccordion = new EventEmitter<boolean>();

  
  constructor() { }

  ngOnInit() {
    console.log(this.activeIndex);
  }

  emitSelectedAllocation(index){
    this.selectAllocationAccordion.emit(index);
  }

}
