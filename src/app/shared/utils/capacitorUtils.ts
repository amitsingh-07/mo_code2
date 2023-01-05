import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Http, HttpDownloadFileResult } from '@capacitor-community/http';

export const FILE_TYPE = 'application/pdf';

@Injectable()

export class CapacitorUtils {
    static readonly isApp = Capacitor.getPlatform() !== 'web';

    static async writeAndOpenFile(blobResponse: any, fileName: string) {
        const data = new Blob([blobResponse], { type: FILE_TYPE });
        var reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = async function () {
          var base64data = reader.result;
          try {
            const result = await Filesystem.writeFile({
              path: 'MoneyOwl/'+fileName,
              data: <string>base64data,
              directory: Directory.Documents,
              recursive: true
            });
            let fileOpener: FileOpener = new FileOpener();
            fileOpener.open(result.uri, data.type)
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
    
            console.log('Wrote file', result.uri);
          } catch (e) {
            console.error('Unable to write file', e);
          }
        }
      }

  static async downloadFile(path: any, fileName: string) {
    console.log('Start Download File');
      const options = {
        url: path,
        filePath: fileName,
        fileDirectory: Directory.Documents,
        // Optional
        method: 'GET',
      };

      try {
        // Writes to local filesystem
        const response: HttpDownloadFileResult = await Http.downloadFile(options);

        console.log('Download File: ', response.path);


        // Then read the file
        if (response.path) {
          const read = await Filesystem.readFile({
            path: response.path,
            directory: Directory.Documents,
          })
          .then(() => console.log('Read File is opened'))
          .catch(e => console.log('Error Reading file', e));;
        }
      } catch (e) {
        console.error('Unable to download file', e);
      }
  }
  
}