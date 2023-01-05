import {
  Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() errorTitle;
  @Input() errorMessage;
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
