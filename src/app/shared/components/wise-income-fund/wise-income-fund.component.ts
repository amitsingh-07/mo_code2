import { Component, EventEmitter, Input, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../http/auth/authentication.service';
@Component({
  selector: 'app-wise-income-fund',
  templateUrl: './wise-income-fund.component.html',
  styleUrls: ['./wise-income-fund.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomeFundComponent implements OnInit {
  @Input('portfolio') portfolio;
  @Input('investmentInput') investmentInput;
  @Output() openModal: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbModal,
    public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  openEditInvestmentModal(){
    this.openModal.emit();
  }
}

