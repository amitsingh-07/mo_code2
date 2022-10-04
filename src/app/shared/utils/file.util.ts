import { Injectable } from '@angular/core';
export const FILE_TYPE = 'application/pdf';
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

@Injectable()
export class FileUtil {

  public downloadPDF(data: any, newWindow: any, fileName: string) {
    if (iOS) {
      const pdfUrl = window.URL.createObjectURL(data);
      if (newWindow.document.readyState === 'complete') {
        newWindow.location.assign(pdfUrl);
      } else {
        newWindow.onload = () => {
          newWindow.location.assign(pdfUrl);
        };
      }
    } else {
      this.saveAs(data, fileName);
    }
  }

  private saveAs(data: any, fileName: string): void {
    const blob = new Blob([data], { type: FILE_TYPE });
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const otherBrowsers = /Android|Windows|Mac/.test(navigator.userAgent);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else if ((isSafari && iOS) || otherBrowsers || isSafari) {
      setTimeout(() => {
        this.downloadFile(fileName, blob);
      }, 1000);
    } else {
      const reader: any = new FileReader();
      reader.onload = ((e) => {
        window.open(reader.result);
      });
      reader.readAsDataURL(blob);
    }
  }

  private downloadFile(fileName: string, blobFile: Blob): void {
    const url = window.URL.createObjectURL(blobFile);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);
  }
}
