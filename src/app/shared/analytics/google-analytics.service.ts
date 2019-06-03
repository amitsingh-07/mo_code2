import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
declare var ga: any;
declare var gtag: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      try {
        if (typeof ga === 'function') {
          if (event instanceof NavigationEnd) {
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  public emitConversionsTracker(trackingId: string) {
    gtag('event', 'conversion', {send_to: trackingId});
  }

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    if (typeof ga === 'function') {
      ga('send', 'event', {
        eventCategory,
        eventLabel,
        eventAction,
        eventValue
        });
      }
    }

  public emitSocial(socialNetwork: string,
                    socialAction: string,
                    socialTarget: string,
                    ) {
      if (typeof ga === 'function') {
        ga('send', 'social', {
          socialNetwork,
          socialAction,
          socialTarget
          });
        }
      }

  // Timing Functions
  public startTime(timeId: string) {
    const name: string = 'time_' + timeId;
    const expireDays = 1;
    const currDate: Date = new Date();
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${currDate}; ${expires}`;
    }

  public getTime(timeId: string) {
    const name: string = 'time_' + timeId;
    const ca: string[] = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;
    let oldDate: string = null;
    const d: Date = new Date();
    let timeDiff = 0;
    const currDate = `${d.toUTCString()}`;

    for (let i = 0; i < caLen; i += 1) {
          c = ca[i].replace(/^\s+/g, '');
          if (c.indexOf(cookieName) === 0) {
              oldDate = c.substring(cookieName.length, c.length);
          }
      }
    if (oldDate !== 'null') {
      timeDiff = (Date.parse(currDate) - Date.parse(oldDate));
      return timeDiff;
    } else {
      return false;
    }
  }

  public endTime(timeId: string) {
    const name: string = 'time_' + timeId;
    const empty = null;
    const d: Date = new Date();
    d.setTime(d.getTime() + 1000 * 10); // Setting Expire in 10secs
    const expires = `expires=${d.toUTCString()}`;
    document.cookie =  `${name}=${empty}; ${expires}`;
  }

  public emitTime(timeId: string,
                  timingCategory: string,
                  timingVar: string,
                  timingLabel: string = null
                ) {
      const timingValue = this.getTime(timeId);
      this.endTime(timeId);
      if (typeof ga === 'function') {
        this.endTime(timeId);
        ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel]);
                }
      }

}
