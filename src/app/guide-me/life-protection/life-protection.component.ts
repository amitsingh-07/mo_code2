import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from './../../shared/header/header.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';

@Component({
  selector: 'app-life-protection',
  templateUrl: './life-protection.component.html',
  styleUrls: ['./life-protection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LifeProtectionComponent implements IPageComponent, OnInit {

  pageTitle: string;
  lpDependentCountForm;

  dependentCountOptions = [0, 1, 2, 3, 4, 5];

  constructor(
    public headerService: HeaderService, private formBuilder: FormBuilder,
    public translate: TranslateService, public guideMeService: GuideMeService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('LIFE_PROTECTION.TITLE');
      this.setPageTitle(this.pageTitle, null, true);
    });
  }

  ngOnInit() {
    this.headerService.setPageTitle(this.pageTitle);

    const dependantCount = this.guideMeService.getUserInfo().dependent;
    this.lpDependentCountForm = this.formBuilder.group({
      dependentCount: dependantCount
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.protectionNeedsPageIndex--;
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  setDropDownDependentCount(value, i) {
    this.lpDependentCountForm.controls.dependentCount.setValue(value);
  }

}
