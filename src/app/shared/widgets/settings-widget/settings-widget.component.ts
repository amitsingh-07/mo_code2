import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToolTipModalComponent } from '../../modal/tooltip-modal/tooltip-modal.component';

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
  @Input() isMobile: boolean;
  @Input() selectedFilterList: any = [];
  @Output() filterProducts: EventEmitter<any>;

  filterResults: any = {};
  filterArgs: any = {};
  defaultSort: IDropDownData;
  constructor(private modal: NgbModal) {
    this.filterProducts = new EventEmitter();
  }
  ngOnInit() {
    if (!this.selectedFilterList) {
      for (const filter of this.filters) {
        this.filterArgs[filter.name] = new Set([]);
      }
      this.filterArgs['premiumFrequency'].add('per month');
    } else {
      this.filterArgs = this.selectedFilterList;
    }
    this.defaultSort = this.sort[0];
  }

  setSort(sort) {
    this.defaultSort = sort;
    this.filterResults = { filters: this.filterArgs, sortProperty: this.defaultSort.value };
    if (!this.isMobile) {
      this.applyFilters();
    }
  }

  unCheckOthers(index, value, c_index, name) {
    for (const fil of this.filters[index].filterTypes) {
      if (value === 'All' && fil.value !== 'All') {
        fil.checked = false;
      }
    }
  }

  applyFilter(name, value, hasAllBtn, p_index, c_index) {

    this.filters[p_index].filterTypes[c_index].checked = !this.filters[p_index].filterTypes[c_index].checked;

    if (hasAllBtn) {
      if (value === 'All') {
        setTimeout(() => {
          this.unCheckOthers(p_index, value, c_index, name);
          this.filterArgs[name].clear();
          this.filters[p_index].filterTypes[c_index].checked = true;
        }, 0);
      } else {
        this.filters[p_index].filterTypes[0].checked = false;
        if (this.filterArgs[name].has(value)) {
          this.filterArgs[name].delete(value);
        } else {
          this.filterArgs[name].add(value);
        }
        const selectedFilterLength = this.filterArgs[name].size;
        if (selectedFilterLength === 0) {
          this.filters[p_index].filterTypes[0].checked = true;
        }

      }
    } else if (name === 'premiumFrequency') {
      this.filterArgs[name].clear();
      if (this.filterArgs[name].has(value)) {
        this.filterArgs[name].delete(value);
      } else {
        this.filterArgs[name].add(value);
      }

      if (this.filters[p_index].filterTypes[c_index].checked) {
        const i = c_index === 1 ? 0 : 1;
        this.filters[p_index].filterTypes[i].checked = !this.filters[p_index].filterTypes[i].checked;
      } else {
        setTimeout(() => {
          this.filters[p_index].filterTypes[c_index].checked = true;
        }, 0);
      }
    }

    this.filterResults = { filters: this.filterArgs, sortProperty: this.defaultSort.value };
    if (!this.isMobile) {
      this.applyFilters();
    }
  }

  applyFilters() {
    console.log(this.filterResults);
    this.filterProducts.emit(this.filterResults);
  }

  showFilterTooltip(toolTip) {
    const ref = this.modal.open(ToolTipModalComponent, { centered: true });
    ref.componentInstance.tooltipTitle = toolTip.title;
    ref.componentInstance.tooltipMessage = toolTip.message;
  }
}
