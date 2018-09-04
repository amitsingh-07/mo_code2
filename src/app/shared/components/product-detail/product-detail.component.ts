import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailComponent implements OnInit {
  @Input() plan: any;
  @Input() protectionType = '';
  @Input() bestValue = false;

  expandedList = [];
  current = 0;
  items: any[];

  constructor(public activeModal: NgbActiveModal) { }

  toggle(position) {
    this.current = position;
    if (this.expandedList.indexOf(position) > -1) {
      this.expandedList = this.expandedList.filter((item) => item !== position);
    } else {
      this.expandedList.push(position);
    }
  }

  isExpanded(position) {
    return this.expandedList.indexOf(position) > -1;
  }

  ngOnInit() {
    this.items = [
      {
        title: 'About Policy',
        description: this.plan.productDescription
      },
      {
        title: 'Reasons To Buy This Plan',
        description: this.plan.whyBuy
      },
      {
        title: 'Payout Details',
        description: this.plan.payOut
      },
      {
        title: 'Unique Features',
        description: this.plan.features
      }
    ];

  }

  selectPlan(data) {
      this.activeModal.close(data);
  }
}
