import {
  Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { PromoCodeService } from '../promo-code.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
@Component({
  selector: 'app-ntuc-member',
  templateUrl: './ntuc-member.component.html',
  styleUrls: ['./ntuc-member.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class NtucMemberComponent implements OnInit {
  ntucMumberForm: FormGroup; 
  promo : any;  
  @Output() ntucMember: EventEmitter<any> = new EventEmitter();
 
  constructor(
    public activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter,
    private promoSvc: PromoCodeService) {
  }
  ngOnInit() {    
    this.promo = this.promoSvc.getSelectedPromo();
    this.ntucMumberForm = new FormGroup({
      mobileNumber: new FormControl(this.promo.mobileNo),
      dob: new FormControl(this.parserFormatter.parse(this.promo.dateOfBirth)),
      nricOrFin: new FormControl('', [Validators.required,Validators.pattern(RegexConstants.nricOrFinLastFourCharacters)])
    });
  }

 
  goToCheckOut(form) {
    this.ntucMember.emit(form.getRawValue());
  }
}
