import { Injectable } from '@angular/core';
import { ISessionMgt } from './sessionMgt.interface';
import { AuthenticationService } from '../../http/auth/authentication.service';

const INSTANCE_MGT = 'mo_cross_tab';
const INSTANCE_ID = 'mo_cross_tab_id';

@Injectable({
  providedIn: 'root'
})

export class SessionsService {

  constructor(private authService: AuthenticationService) {
    if (window.localStorage && window.sessionStorage) {
      // Define new local storage and session if doesnt exist
      if (!window.localStorage.getItem(INSTANCE_MGT)) {
        const sessMgt: ISessionMgt = {
          active: '',
          sessionList: [],
        };
        this.commit(sessMgt);
      }
      const randId = this.newInstance();
      this.setActiveInstance(randId);
    }
  }

  // Creating New Instance
  newInstance() {
    if (window.localStorage && window.sessionStorage) {
      const randId = Math.random().toString(36).substring(7);
      const sessMgt: ISessionMgt = JSON.parse(window.localStorage.getItem(INSTANCE_MGT));
      sessMgt.sessionList.push(randId);
      this.commit(sessMgt);
      if (this.authService.isAuthenticated()) {
        window.location.reload();
      }
      return randId;
    }
    return null;
  }

  getInstance() {
    if (window.localStorage && window.sessionStorage && window.sessionStorage.getItem(INSTANCE_ID)) {
      return window.sessionStorage.getItem(INSTANCE_ID);
    }
  }

  // Setting Active Instance
  setActiveInstance(instId: string) {
    if (window.localStorage && window.sessionStorage && window.localStorage.getItem(INSTANCE_MGT)) {
      const sessMgt: ISessionMgt = JSON.parse(window.localStorage.getItem(INSTANCE_MGT));
      sessMgt.active = instId;
      this.commit(sessMgt);
      window.sessionStorage.setItem(INSTANCE_ID, instId);
    }
  }

  createNewActiveInstance() {
    const randId = this.newInstance();
    this.setActiveInstance(randId);
  }

  // Destroy Old Instance
  destroyInstance() {
    if (window.localStorage && window.sessionStorage) {
      const oldInstId = window.sessionStorage.getItem(INSTANCE_ID);
      const sessMgt: ISessionMgt = JSON.parse(window.localStorage.getItem(INSTANCE_MGT));
      const sessList = sessMgt.sessionList;
      sessList.splice(sessList.indexOf(oldInstId), 1);
      sessMgt.sessionList = sessList;
      this.commit(sessMgt);
    }
  }

  private commit(sessMgt: ISessionMgt) {
    if (window.localStorage && window.sessionStorage) {
      window.localStorage.setItem(INSTANCE_MGT, JSON.stringify(sessMgt));
    }
  }

}