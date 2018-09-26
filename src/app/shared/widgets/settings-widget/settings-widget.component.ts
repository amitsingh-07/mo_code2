import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

export interface IDropDownData {
  displayText: string;
  value: string;
}

@Component({
  selector: 'app-settings-widget',
  templateUrl: './settings-widget.component.html',
  styleUrls: ['./settings-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsWidgetComponent implements OnInit {

  @Input() sort: any = [];
  @Input() filters: any = [];
  @Output() filterProducts = new EventEmitter();
  @Output() selectedFilters = new EventEmitter();

  filterArgs: any = {};
  selectedFiltersList;
  defaultSort: IDropDownData;
  constructor() {

  }

  ngOnInit() {
    this.defaultSort = this.sort[0];
    this.filterArgs['premiumFrequency'] = new Set([]);
    this.filterArgs['premiumFrequency'].add('per month');
  }

  setSort(sort) {
    this.defaultSort = sort;
    this.filterProducts.emit({ filters: this.filterArgs, sortProperty: this.defaultSort.value });
  }

  uncheck(index, value, c_index, name) {
    const length = this.filters[index].filterTypes.length;
    let checkedLength = 0;
    for (const fil of this.filters[index].filterTypes) {
      if (value === 'All' && fil.value !== 'All') {
        fil.checked = false;
      } else if (value !== 'All' && value !== fil.value) {
        this.filters[index].filterTypes[0].checked = false;
      }
      if (fil.checked) {
        checkedLength++;
      }
    }
    if (checkedLength === length - 1) {
      delete this.filterArgs[name];
      this.selectedFiltersList = this.filterArgs;
      return false;
    }
    return true;
  }

  applyFilter(name, value, allBtn, p_index, c_index) {
    this.filters[p_index].filterTypes[c_index].checked = !this.filters[p_index].filterTypes[c_index].checked;
    if (allBtn) {
      if (!this.uncheck(p_index, value, c_index, name)) {
        return false;
      }
    }

    if (name === 'premiumFrequency') {
      this.filterArgs[name].clear();
    }

    if (this.filterArgs.hasOwnProperty(name)) {
      if (value === 'All') {
        delete this.filterArgs[name];
      } else {
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
      if (value !== 'All') {
        this.filterArgs[name] = new Set([]);
        this.filterArgs[name].add(value);
      }
    }

    if (value === 'All') {
      setTimeout(() => { this.filters[p_index].filterTypes[c_index].checked = true; }, 0);
    } else if (name === 'premiumFrequency') {
      if (this.filters[p_index].filterTypes[c_index].checked) {
        const i = c_index === 1 ? 0 : 1;
        this.filters[p_index].filterTypes[i].checked = !this.filters[p_index].filterTypes[i].checked;
      } else {
        setTimeout(() => { this.filters[p_index].filterTypes[c_index].checked = true; }, 0);
      }
    }
    this.filterProducts.emit({ filters: this.filterArgs, sortProperty: this.defaultSort.value });
    this.selectedFiltersList = this.filterArgs;
  }

  applyFilters() {
    this.selectedFilters.emit({ filters: this.selectedFiltersList, sortProperty: this.defaultSort.value });
  }
}
