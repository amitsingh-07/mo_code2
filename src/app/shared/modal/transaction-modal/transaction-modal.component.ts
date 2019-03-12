import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit {
  lifeProtectionForm: FormGroup;
  formValues: any;
  month = '';
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];
  year = '';
  yearNames = ['2000' , '2001' , '2002'];
  constructor(
    public activeModal: NgbActiveModal, 
    private config: NgbDatepickerConfig, 
    private formBuilder: FormBuilder
    ) 
  {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed'; 
  }

  ngOnInit() {
    //this.formValues.month = this.formValues.month;
    // this.transactionFilterForm = this.formBuilder.group({
    //   month: [this.formValues.month, Validators.required]
    // });
    // if (this.formValues.month !== undefined) {
    //   this.selectMonth(this.formValues.month);
    // }
  }
  selectMonth(in_month) {
    this.month = in_month;
  }
  selectYear(in_year) {
    this.year = in_year;
  }
}
