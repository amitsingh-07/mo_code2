import { Component, OnInit } from '@angular/core';
import { ComprehensiveService } from 'src/app/comprehensive/comprehensive.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/config/config.service';
import { SignUpService } from '../../sign-up.service';
@Component({
  selector: 'app-login-corpbiz',
  templateUrl: './login-corpbiz.component.html',
  styleUrls: ['./login-corpbiz.component.scss']
})
export class LoginCorpbizComponent implements OnInit {

  showSingpassLogin: boolean = true;
  constructor(
    private comprehensiveService: ComprehensiveService,
    private translate: TranslateService,
    private configService: ConfigService,
    private signUpService: SignUpService
  ) {
    this.configService.getConfig().subscribe( (config)=>{
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    })
  }

  ngOnInit() {
  }

  showToolTipModal(toolTipTitle, toolTipMessage){
    const toolTipParams = {
      TITLE: this.translate.instant('CORPBIZ_LOGIN.TOOLTIP.'+toolTipTitle),
      DESCRIPTION: this.translate.instant(toolTipMessage)
    };
    this.signUpService.openTooltipModal(toolTipParams)
  }

}
