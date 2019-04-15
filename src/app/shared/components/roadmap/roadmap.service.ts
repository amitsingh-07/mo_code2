import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { IRoadmap, IRoadmapItem } from './roadmap.interface';

const SESSION_STORAGE_KEY = 'app_roadmap';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  roadmapData: IRoadmap;
  private roadmapSubject = new BehaviorSubject(null);
  roadmapDataChanges = this.roadmapSubject.asObservable();

  roadMapData: IRoadmap;

  changeData = new Subject();

  constructor(private router: Router) {
    this.loadData(this.getDataFromSession());
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setDataToSession(this.roadmapData);
      }
    });
  }

  loadData(data: IRoadmap) {
    this.roadmapData = data;
    this.roadmapSubject.next(this.roadmapData);
  }

  addItem(item: IRoadmapItem) {
    if (this.roadmapData.items) {
      this.roadmapData.items.push(item);
    }
  }

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

}
