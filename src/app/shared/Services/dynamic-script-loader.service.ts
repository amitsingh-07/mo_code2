import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'singpass-ndi', src: environment.singpassAuthJs }
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({script: name, loaded: true, status: 'Loaded'});
            };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

  unload(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.unloadScript(script)));
    return Promise.all(promises);
  }

  unloadScript(name: string) {
    return new Promise((resolve, reject) => {
      var allElements = document.getElementsByTagName("script")
      for (var i = allElements.length; i >= 0; i--) {
        if (allElements[i] && allElements[i].getAttribute('src') != null && allElements[i].getAttribute('src').indexOf(this.scripts[name].src) != -1) {
          console.log("FOUND = " + this.scripts[name].src)
          allElements[i].parentNode.removeChild(allElements[i])
          resolve({ script: name, unloaded: true, status: 'UnLoaded' });
        }
      }
    });
  }

}