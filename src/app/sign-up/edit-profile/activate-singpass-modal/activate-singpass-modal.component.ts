import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-activate-singpass-modal',
  templateUrl: './activate-singpass-modal.component.html',
  styleUrls: ['./activate-singpass-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivateSingpassModalComponent{
  @Input('label') label;
  @Input('position') position;
  @Input() errorMessage: any;
  @Input() errorMessageHTML: any;
  @Input() secondaryActionLabel: any;
  @Input() isLinked: boolean;
  @Output() primaryAction = new EventEmitter<any>();
  
  constructor(
    public activeModal: NgbActiveModal,
    public readonly translate: TranslateService
  ) {}

  primaryActionSelected() {
    this.primaryAction.emit();
    this.activeModal.close();
  }

}
