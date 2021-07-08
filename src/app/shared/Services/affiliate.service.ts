import { Injectable } from '@angular/core';
import { ConfigService, IConfig } from 'src/app/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  enableAffiliate = false;
  affiliateAttributionInMs = 86400000; //One day

  constructor(
    private configService: ConfigService
  ) {
    this.configService.getConfig().subscribe((config: IConfig) => {
        this.enableAffiliate = config.affiliateEnabled;
        this.affiliateAttributionInMs = config.affiliateAttributionInMs;
    });
  }

  // For affiliate program
  public appendClickId(payload) {
    if (this.enableAffiliate && localStorage.getItem("irclickid_json")) {
      let irclickidJSON = JSON.parse(localStorage.getItem("irclickid_json"));
      let clickDate = new Date(irclickidJSON['eventDate']);
      // Check if click event date has exceed 30 days
      if (new Date().getTime() - clickDate.getTime() < this.affiliateAttributionInMs) {
        payload.irClickId = irclickidJSON['irclickid'];
        payload.clickEventDate = irclickidJSON['eventDate'];
      } else {
          this.removeClickIdJson();
      }
      return payload;
    } else {
        return payload;
    }
  }

  public removeClickIdJson() {
      if (this.enableAffiliate && localStorage.getItem("irclickid_json")) {
        localStorage.removeItem('irclickid_json');
      }
  }
}
