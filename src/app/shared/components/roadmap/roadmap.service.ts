import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS, INVESTMENT_ACCOUNT_ROUTES
} from '../../../investment-account/investment-account-routes.constants';
import { ERoadmapStatus, IRoadmap, IRoadmapItem } from './roadmap.interface';

const SESSION_STORAGE_KEY = 'app_roadmap';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  private roadmapData: IRoadmap;
  private roadmapSubject = new BehaviorSubject(null);
  roadmapDataChanges = this.roadmapSubject.asObservable();

  constructor(private router: Router) {
    //this.loadData(this.getDataFromSession());
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        //this.setDataToSession(this.roadmapData);
      }
    });
  }

  /* To Set Initial Data */
  loadData(data: IRoadmap) {
    this.roadmapData = data;
    this.roadmapSubject.next(this.roadmapData);
  }

  addItem(item: IRoadmapItem, path?) {
    const existingItem = this.findExistingItem(item.path);
    if (!existingItem) {
      this.roadmapData.items.push(item);
      this.roadmapSubject.next(this.roadmapData);
    }
  }

  removeItem(path) {
    const existingItem = this.findExistingItem(path);
    const index = this.roadmapData.items.indexOf(existingItem);
    if (index > -1) {
      this.roadmapData.items.splice(index, 1);
    }
  }

  updateStatus() {
    let itemFound = false;
    this.roadmapData.items.forEach((item) => {
      item.path = this.cleanRelativePath(item.path);
      if (item.path.indexOf(this.router.url) > -1) {
        itemFound = true;
        item.status = ERoadmapStatus.IN_PROGRESS;
      } else {
        if (itemFound) {
          item.status = ERoadmapStatus.NOT_STARTED;
        } else {
          item.status = ERoadmapStatus.COMPLETED;
        }
      }
    });
  }

  /*
  getDataFromSession() {
    let data;
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      data = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return data;
  }

  setDataToSession(data) {
    if (data) {
      if (window.sessionStorage) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.roadmapData));
      }
    }
  }
  */

  cleanRelativePath(pathList) {
    const cleanedList = [];
    let cleanedPath;
    pathList.forEach((path) => {
      cleanedPath = path.replace(/\./g, '');
      cleanedList.push(cleanedPath);
    });
    return cleanedList;
  }

  findExistingItem(path) {
    const roadmapItem = this.roadmapData.items.filter(
      (item) => (item.path.indexOf(this.cleanRelativePath(path)[0]) > -1)
    );
    return roadmapItem[0];
  }

}
