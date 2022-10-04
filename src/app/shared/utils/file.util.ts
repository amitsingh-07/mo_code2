import { Injectable } from '@angular/core';
export const FILE_TYPE = 'application/pdf';

@Injectable()
export class FileUtil {

  public downloadPDF(data: any, fileName: string) {
    let newWindow;
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (iOS) {
      newWindow = window.open();
    }
    const pdfUrl = window.URL.createObjectURL(data);
      if (iOS) {
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
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      setTimeout(() => {
        this.downloadFile(data, fileName);
      }, 1000);
    }
  }

  private downloadFile(data: any, fileName: string): void {
    const blob = new Blob([data], { type: FILE_TYPE });
    const url = window.URL.createObjectURL(blob);
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
