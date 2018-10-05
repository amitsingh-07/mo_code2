import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() selectedFilterList: any;
  @Output() filterProducts: EventEmitter<any>;
  @Output() showFilterTooltip: EventEmitter<any>;

  filterResults: any = {};
  filterArgs: any = {};
  defaultSort: IDropDownData;
  types;
  modalData;

  constructor(private translate: TranslateService) {
    this.filterProducts = new EventEmitter();
    this.showFilterTooltip = new EventEmitter();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.types = this.translate.instant('SETTINGS.TYPES');
      this.modalData = this.translate.instant('FILTER_TOOLTIPS.CLAIM_CRITERIA');
    });
  }
  ngOnInit() {
    if (this.selectedFilterList && this.selectedFilterList.premiumFrequency) {
      this.filterArgs = this.selectedFilterList;
      if (!this.selectedFilterList['premiumFrequency']) {
        this.filterArgs['premiumFrequency'] = new Set(['per month']);
      }
    } else {
      for (const filter of this.filters) {
        this.filterArgs[filter.name] = new Set([]);
      }
      this.filterArgs['premiumFrequency'] = new Set(['per month']);
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

  // tslint:disable-next-line:cognitive-complexity
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
      this.filterArgs[name].add(value);

      if (c_index === 0) {
        this.filters[p_index].filterTypes[1].checked = false;
      } else {
        this.filters[p_index].filterTypes[0].checked = false;
      }
    }

    this.filterResults = { filters: this.filterArgs, sortProperty: this.defaultSort.value };
    if (!this.isMobile) {
      this.applyFilters();
    }
  }

  applyFilters() {
    console.log({ filters: this.filterArgs, sortProperty: this.defaultSort.value });
    this.filterProducts.emit({ filters: this.filterArgs, sortProperty: this.defaultSort.value });
  }

  showTooltip(toolTip) {
    this.showFilterTooltip.emit(toolTip);
  }

  close() {
    this.filterProducts.emit(null);
  }
}
