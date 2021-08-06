import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-years-needed',
  templateUrl: './years-needed.component.html',
  styleUrls: ['./years-needed.component.scss']
})
export class YearsNeededComponent implements OnInit {
  selectedOption = '';
  profileType;
  yearsNeeded;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.yearsNeeded = this.translate.instant('CMP.DEPENDANT_SELECTION.YEARS_NEEDED');
      console.log(this.yearsNeeded);
      this.profileType = this.translate.instant('CMP.DEPENDANT_SELECTION.PROFILE_TYPE');
      console.log(this.profileType);
  });
}

  ngOnInit() {
  }
  showMessage(value) {
    this.selectedOption = value ;
  }

}
