import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FormControl, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ltc-assessment',
  templateUrl: './ltc-assessment.component.html',
  styleUrls: ['./ltc-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LtcAssessmentComponent implements IPageComponent, OnInit {

  pageTitle: string;
  headerService: HeaderService;
  setPageTitle(title: string, subTitle?: string, showIcon?: boolean): void {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}
