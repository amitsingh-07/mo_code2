import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-settings-widget',
  templateUrl: './settings-widget.component.html',
  styleUrls: ['./settings-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsWidgetComponent implements OnInit {

  @Input() filters: any = [];
  @Output() filterProducts = new EventEmitter();

  filterArgs: any = {};
  flrString;
  sorts: any = ['Highest Rating'];
  defaultSort = 'Highest Rating';
  constructor() { }

  ngOnInit() {
  }

  applyFilter(name, value) {
    name = 'plan.' + name;
    if (this.filterArgs.hasOwnProperty(name)) {
      if (value === 'All')  {
        delete this.filterArgs[name];
      } else {
        value = name + ' === \'' + value + '\'';
        if (this.filterArgs[name].has(value)) {
          this.filterArgs[name].delete(value);
          if (this.filterArgs[name].size === 0) {
            delete this.filterArgs[name];
          }
        } else {
          this.filterArgs[name].add(value);
        }
      }
    } else {
      value = name + ' === \'' + value + '\'';
      this.filterArgs[name] = new Set([]);
      this.filterArgs[name].add(value);
    }
    let flrString = '';
    for (const type in this.filterArgs) {
      if (this.filterArgs.hasOwnProperty(type)) {
        flrString +=  Array.from(this.filterArgs[type]).join(' || ');
        flrString += ' || ';
      }
    }
    this.flrString = flrString.substring(0, flrString.length - 3);
    this.filterProducts.emit(this.flrString);
  }
}
