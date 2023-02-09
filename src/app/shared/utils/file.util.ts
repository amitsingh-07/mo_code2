import { Injectable } from '@angular/core';

import { CapacitorUtils } from './capacitor.util';
import { Util } from './util';
import { environment } from '../../../environments/environment';

export const FILE_TYPE = 'application/pdf';
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

@Injectable()
export class FileUtil {

  public downloadPDF(data: any, newWindow: any, fileName: string) {
    const pdfUrl = window.URL.createObjectURL(data);
    if (CapacitorUtils.isApp) {
      CapacitorUtils.openNativePDF(data, fileName);
    } else {
      if (iOS) {
        if (newWindow.document.readyState === 'complete') {
          newWindow.location.assign(pdfUrl);
        } else {
          newWindow.onload = () => {
            newWindow.location.assign(pdfUrl);
          };
        }
      } else {
        const nav = (window.navigator as any);
        if (nav && nav.msSaveOrOpenBlob) {
          const blob = new Blob([data], { type: FILE_TYPE });
          nav.msSaveOrOpenBlob(blob, fileName);
        } else {
          this.createDownloadUrl(fileName, pdfUrl, false);
        }
      }
    }
  }

  public createDownloadUrl(fileName: string, pdfUrl: string, appendEnv: boolean): void {
    let urlStr = pdfUrl;
    if (appendEnv) {
      urlStr = environment.apiBaseUrl + '/app/' + pdfUrl;
    }
    
    if (CapacitorUtils.isApp || iOS) {
      Util.openExternalUrl(urlStr)
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = urlStr;
      a.download = fileName;
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlStr);
      }, 1000);
    }
  }
}
