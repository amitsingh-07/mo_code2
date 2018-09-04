import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-breakdown-bar',
  templateUrl: './breakdown-bar.component.html',
  styleUrls: ['./breakdown-bar.component.scss']
})
export class BreakdownBarComponent implements OnInit {

  @Input('allocation') allocation;
  @Input('activeIndex') activeIndex;
  @Input('colors') colors;

  @Output() selectAllocationBar = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    
  }

  emitSelectedAllocation(index,isOpen){
    this.selectAllocationBar.emit(index);
  }

}
