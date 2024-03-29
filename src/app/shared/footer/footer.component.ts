import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from './../../../environments/environment';
import { ConfigService, IConfig } from './../../config/config.service';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  showFooter = false;
  isMaintenanceEnabled = false;
  copyrightYear: string;
  showFooterItems = true;
  hubspotLiveChat = true;

  constructor(
    private footerService: FooterService, private cdr: ChangeDetectorRef,
    public readonly translate: TranslateService, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.translate.use(config.language);
      this.isMaintenanceEnabled = config.maintenanceEnabled;
    });
    if (environment.hideHomepage) {
      this.showFooterItems = false;
    }
  }

  ngOnInit() {
    const currentDate = new Date();
    this.copyrightYear = `© ${currentDate.getFullYear() - 1}-${currentDate.getFullYear()}`;
  }

  ngAfterViewInit() {
    this.footerService.currentFooterVisibility.subscribe((showFooter) => {
      this.showFooter = showFooter;
      this.cdr.detectChanges();
      // Load live chat for pages with footer only
      if (this.showFooter && this.hubspotLiveChat) {
        if (window['HubSpotConversations']) {
          this.onConversationsAPIReadyLoad();
        } else {
          window['hsConversationsOnReady'] = [this.onConversationsAPIReadyLoad];
        }
      } else {
        if (window['HubSpotConversations']) {
          this.onConversationAPIReadyRemove();
        } else {
          window['hsConversationsOnReady'] = [this.onConversationAPIReadyRemove];
        }
      }
    });
  }

  onConversationsAPIReadyLoad() {
    window['HubSpotConversations'].widget.load();
  }

  onConversationAPIReadyRemove() {
    window['HubSpotConversations'].widget.remove();
  }
}
