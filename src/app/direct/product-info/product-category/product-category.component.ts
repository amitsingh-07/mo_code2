import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DirectApiService } from './../../direct.api.service';
import { IProductCategory } from './product-category';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductCategoryComponent implements DoCheck, OnInit {

  @Input() data: IProductCategory;
  title;
  icon;
  iconAlt;
  link;
  active;
  @Output() Details = new EventEmitter();

  ngDoCheck() {
    if (this.data) {
      this.active = this.data.active;
      this.title = this.data.prodCatName;
      this.link = this.data.prodLink;
      if (this.active) {
        this.icon = this.data.prodCatIconAlt;
      } else {
        this.icon = this.data.prodCatIcon;
      }
    }
  }

  constructor() { }

  ngOnInit() {
  }
}
