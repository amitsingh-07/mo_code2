import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-life-protection-modal',
  templateUrl: './life-protection-modal.component.html',
  styleUrls: ['./life-protection-modal.component.scss']
})
export class LifeProtectionModalComponent implements OnInit {
  selectedOption = '';
  profileType;
  yearsNeeded;
  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.yearsNeeded = this.translate.instant('LIFE_PROTECTION.YEARS_NEEDED');
      this.profileType = this.translate.instant('LIFE_PROTECTION.PROFILE_TYPE');
  });
}

  ngOnInit() {
  }
  showMessage(value) {
    this.selectedOption = value ;
  }
}
