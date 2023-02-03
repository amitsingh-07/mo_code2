import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
// import { Http, HttpDownloadFileResult } from '@capacitor-community/http';

export const FILE_TYPE = 'application/pdf';
export const IOS_DEVICE = 'ios';
export const ANDROID_DEVICE = 'android';

@Injectable()

export class CapacitorUtils {
  static readonly isApp = Capacitor.isNativePlatform();
  static readonly isIOSDevice = Capacitor.getPlatform() === IOS_DEVICE;
  static readonly isAndroidDevice = Capacitor.getPlatform() === ANDROID_DEVICE;


  // static async writeAndOpenFile(blobResponse: any, fileName: string) {
  //   const data = new Blob([blobResponse], { type: FILE_TYPE });
  //   var reader = new FileReader();
  //   reader.readAsDataURL(data);
  //   reader.onloadend = async function () {
  //     var base64data = reader.result;
  //     try {
  //       const result = await Filesystem.writeFile({
  //         path: 'MoneyOwl/' + fileName,
  //         data: <string>base64data,
  //         directory: Directory.Documents,
  //         recursive: true
  //       });
  //       FileOpener.open({ filePath: result.uri, contentType: FILE_TYPE })
  //         .then(() => console.log('File is opened'))
  //         .catch(e => console.log('Error opening file', e));

  //       console.log('Wrote file', result.uri);
  //     } catch (e) {
  //       console.error('Unable to write file', e);
  //     }
  //   }
  // }

  // static async downloadFile(path: any, fileName: string) {
  //   console.log('Start Download File');
  //   const options = {
  //     url: path,
  //     filePath: fileName,
  //     fileDirectory: Directory.Documents,
  //     // Optional
  //     method: 'GET',
  //   };

  //   try {
  //     // Writes to local filesystem
  //     const response: HttpDownloadFileResult = await Http.downloadFile(options);
  //     console.log('Download File: ', response.path);
  //     // Then read the file
  //     if (response.path) {
  //       const read = await Filesystem.readFile({
  //         path: response.path,
  //         directory: Directory.Documents,
  //       })
  //         .then(() => console.log('Read File is opened'))
  //         .catch(e => console.log('Error Reading file', e));;
  //     }
  //   } catch (e) {
  //     console.error('Unable to download file', e);
  //   }
  // }

  //Convert blob to base64​
  static blobToBase64(entry) {
    const reader = new FileReader();
    reader.readAsDataURL(entry);
    return reader;
  };

  //Get file from cache & open using fileopener​
  static openPdfFile(filename) {
    Filesystem.getUri({
      directory: Directory.Cache,
      path: filename,
    }).then(
      (getUriResult) => {
        const path = getUriResult.uri;
        FileOpener.open({ filePath: path, contentType: FILE_TYPE });
        console.log(`File ${filename} written to ${path}`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  static async openNativePDF(pdfData, filename) {
    const blob = new Blob([pdfData], { type: FILE_TYPE });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      writeTempFileThenOpenPdf(filename, base64data);
    };
    //Write file to cache​
    const writeTempFileThenOpenPdf = (filename, base64data) => {
      Filesystem.writeFile({
        path: filename,
        data: base64data,
        directory: Directory.Cache,
      })
        .then((writeFileResult) => {
          this.openPdfFile(filename);
          console.log(`File ${filename} written`);
        })
        .catch((e) => {
          console.error(e);
        });
    };
  }​
}