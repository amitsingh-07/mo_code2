import { Injectable } from '@angular/core';

export const FILE_TYPE = 'application/pdf';
@Injectable()
export class FileUtil {

  public saveAs(data: any, fileName: string): void {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const otherBrowsers = /Android|Windows/.test(navigator.userAgent);

    const blob = new Blob([data], { type: FILE_TYPE });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else if ((isSafari && iOS) || otherBrowsers || isSafari) {
      setTimeout(() => {
        this.downloadFile(data, fileName);
      }, 1000);
    } else {
      const reader: any = new FileReader();
      const out = new Blob([data], { type: FILE_TYPE });
      reader.onload = ((e) => {
        window.open(reader.result);
      });
      reader.readAsDataURL(out);
    }
  }

  public downloadFile(data: any, fileName: string): void {
    const blob = new Blob([data], { type: FILE_TYPE });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

  }
}
