import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WillWritingApiService } from 'src/app/will-writing/will-writing.api.service';

import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-download-will',
  templateUrl: './download-will.component.html',
  styleUrls: ['./download-will.component.scss']
})
export class DownloadWillComponent implements OnInit, OnDestroy {

  customerId: string;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute, private willWritingApiService: WillWritingApiService,
    private authService: AuthenticationService) {
    this.subscription = this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.customerId = (params['id']);
        if (this.authService.isAuthenticated) {
          this.authService.authenticate().subscribe((token) => {
            this.downloadWill();
          });
        }
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  downloadWill() {
    /*this.willWritingApiService.downloadWillById(this.customerId).subscribe((data: any) => {
      this.saveAs(data);
    }, (error) => console.log(error));*/
  }

  saveAs(data) {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const otherBrowsers = /Android|Windows/.test(navigator.userAgent);

    const blob = new Blob([data], { type: 'application/pdf' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'MoneyOwl Will writing.pdf');
    } else if ((isSafari && iOS) || otherBrowsers || isSafari) {
      setTimeout(() => {
        this.downloadFile(data);
      }, 1000);
    } else {
      const reader: any = new FileReader();
      const out = new Blob([data], { type: 'application/pdf' });
      reader.onload = ((e) => {
        window.open(reader.result);
      });
      reader.readAsDataURL(out);
    }
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'MoneyOwl Will Writing.pdf';
    a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

  }
}
