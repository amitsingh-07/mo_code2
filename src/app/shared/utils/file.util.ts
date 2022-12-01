import { Injectable } from '@angular/core';
export const FILE_TYPE = 'application/pdf';
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

@Injectable()
export class FileUtil {

  public downloadPDF(data: any, newWindow: any, fileName: string) {
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
      const nav = (window.navigator as any);
      if (nav && nav.msSaveOrOpenBlob) {
        const blob = new Blob([data], { type: FILE_TYPE });
        nav.msSaveOrOpenBlob(blob, fileName);
      } else {
        this.createDownloadUrl(fileName, pdfUrl);
      }
    }
  }

  public createDownloadUrl(fileName: string, pdfUrl: string): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = pdfUrl;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(pdfUrl);
    }, 1000);
  }
}
