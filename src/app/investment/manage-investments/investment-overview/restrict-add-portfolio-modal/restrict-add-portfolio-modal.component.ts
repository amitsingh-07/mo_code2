import {
  Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegexConstants } from '../../../../shared/utils/api.regex.constants';
import { SignUpService } from '../../../../sign-up/sign-up.service';
import { ManageInvestmentsService } from '../../manage-investments.service';

@Component({
  selector: 'app-restrict-add-portfolio-modal',
  templateUrl: './restrict-add-portfolio-modal.component.html',
  styleUrls: ['./restrict-add-portfolio-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RestrictAddPortfolioModalComponent implements OnInit {
  @Input() banks;
  @Input() fullName;
  @Input() bankDetails;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  addBankForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private manageInvestmentsService: ManageInvestmentsService,
    private signUpService: SignUpService
  ) { }

  ngOnInit() {
    
  }

}
