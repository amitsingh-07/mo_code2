import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionModalComponent implements OnInit {
  userInfoForm: FormGroup;
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
    this.userInfoForm = this.formBuilder.group({
      dob: [null, Validators.required]
    });
  }

}
