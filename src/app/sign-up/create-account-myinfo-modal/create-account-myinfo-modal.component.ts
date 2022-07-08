import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-create-account-myinfo-modal',
  templateUrl: './create-account-myinfo-modal.component.html',
  styleUrls: ['./create-account-myinfo-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountMyinfoModalComponent implements OnInit {
  @Input() primaryActionLabel: any;
  @Input() closeBtn = true;
  @Output() primaryAction = new EventEmitter<any>();
  @Output() closeAction = new EventEmitter<any>();
  @Output() myInfoEnableFlags = new EventEmitter<any>();
  myInfoEnableForm: FormGroup;
  
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.myInfoEnableForm = this.formBuilder.group({
      cpfHousingFlag: [true],
      vehicleFlag: [true]
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

  primaryActionSelected() {
    this.primaryAction.emit();
    this.myInfoEnableFlags.emit(this.myInfoEnableForm.value);
    this.activeModal.close();
  }

  closeIconAction() {
    this.closeAction.emit();
    this.activeModal.dismiss('Cross click');    
  }

}
