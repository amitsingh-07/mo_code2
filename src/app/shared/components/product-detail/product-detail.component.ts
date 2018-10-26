import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() isDirect;
  @Input() frequencyType;
  @Input() isSelected;
  @Input() isViewMode;

  expandedList = [];
  current = 0;
  items: any[];

  lblAboutPolicy;
  lblReasons;
  lblPayout;
  lblFeatures;

  constructor(public activeModal: NgbActiveModal, public translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.lblAboutPolicy = this.translate.instant('PRODUCT_DETAILS.LBL_ABOUT_POLICY');
      this.lblReasons = this.translate.instant('PRODUCT_DETAILS.LBL_REASONS_TO_BUY');
      this.lblPayout = this.translate.instant('PRODUCT_DETAILS.LBL_PAYOUT');
      this.lblFeatures = this.translate.instant('PRODUCT_DETAILS.LBL_UNIQUE_FEATURES');
    });
  }

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
        title: this.lblAboutPolicy,
        description: this.plan.productDescription
      },
      {
        title: this.lblReasons,
        description: this.plan.whyBuy
      },
      {
        title: this.lblPayout,
        description: this.plan.payOut
      }
    ];

    if (this.plan.features && this.plan.features.length > 0) {
      this.items.push(
        {
          title: this.lblFeatures,
          description: this.plan.features
        });
    }

  }

  selectPlan(data) {
    this.activeModal.close(data);
  }
}
