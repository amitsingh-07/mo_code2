import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-long-term-care-form',
  templateUrl: './long-term-care-form.component.html',
  styleUrls: ['./long-term-care-form.component.scss']
})
export class LongTermCareFormComponent implements OnInit {
  formValues: any;
  longTermCareForm: FormGroup;
  monthlyPayoutList = Array(26).fill(500).map((x, i) => x += i * 100);
  selectedMonthlyPayout = 500;

  constructor( private directService: DirectService, private modal: NgbModal,
               private parserFormatter: NgbDateParserFormatter,
               private formBuilder: FormBuilder,
               private config: NgbDatepickerConfig ) {
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      config.outsideDays = 'collapsed';
     }

  ngOnInit() {
    this.formValues = this.directService.getDirectFormData();
    this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.longTermCareForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      monthlyPayout: [this.formValues.duration]
    });
  }

  selectMonthlyPayout(selectedMonthlyPayout) {
    this.selectedMonthlyPayout = selectedMonthlyPayout;
  }

}
