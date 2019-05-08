import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-instruction-steps',
  templateUrl: './instruction-steps.component.html',
  styleUrls: ['./instruction-steps.component.scss']
})
export class InstructionStepsComponent implements OnInit {

  @Input() bankDetails;
  @Input() paynowDetails;
  @Input() showBankTransferIns;

  constructor(public readonly translate: TranslateService) { }

  ngOnInit() {
  }

}
