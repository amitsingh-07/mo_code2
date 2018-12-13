import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateStoreService {
    private store: any;
    constructor() {
        this.store = new Object();
    }

    has(name: string) {
        return this.store.hasOwnProperty(name);
    }

    saveState(name: string, data: any) {
        this.store[name] = data;
    }

    getState(name: string) {
        return this.store[name];
    }

    clearState(name: string) {
        delete this.store[name];
    }
}
