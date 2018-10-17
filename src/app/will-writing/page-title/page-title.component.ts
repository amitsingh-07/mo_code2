import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageTitleComponent implements OnInit {
  @Input() pageTitle: any;
  @Input() step: any;
  @Output() showTooltip: EventEmitter<any> = new EventEmitter();

  constructor(
    private _location: Location
  ) { }

  ngOnInit() {
  }

  goBack() {
    this._location.back();
  }

  openToolTipModal(tooltip) {
    this.showTooltip.emit();
  }

}
