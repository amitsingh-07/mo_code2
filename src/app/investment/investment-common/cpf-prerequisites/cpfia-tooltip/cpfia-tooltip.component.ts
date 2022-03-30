import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cpfia-tooltip',
  templateUrl: './cpfia-tooltip.component.html',
  styleUrls: ['./cpfia-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfiaTooltipComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    public readonly translate: TranslateService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit(): void {
  }

  closeIconAction() {
    this.activeModal.dismiss('Cross click');
  }

}
