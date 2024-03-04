
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/config/config.service';
@Component({
  selector: 'app-upgrading-progress',
  templateUrl: './upgrading-progress.component.html',
  styleUrls: ['./upgrading-progress.component.scss']
})
export class UpgradingProgressComponent implements OnInit {
  fetchdata: string;
  constructor(private configService: ConfigService, private translate: TranslateService) {
    this.configService.getConfig().subscribe((config)=>{
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.fetchdata = this.translate.instant('DASHBOARD.PROFILE.WELCOME');
    })
  }
  // constructor(private configService: ConfigService, private translate: TranslateService){
  //   this.translate.setDefaultLang('hi');
  //   this.translate.use('hi');
  // }

  ngOnInit() {
  }

}
