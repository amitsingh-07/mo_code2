import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ERoadmapStatus, IRoadmap, IRoadmapItem } from './roadmap.interface';
import { RoadmapService } from './roadmap.service';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  roadmapData: IRoadmap;

  constructor(
    private router: Router,
    private roadmapService: RoadmapService
  ) { }

  ngOnInit() {
    this.roadmapService.roadmapDataChanges.subscribe((data) => {
      this.roadmapData = data;
      this.updateStatus();
    });
  }

  addItem(item: IRoadmapItem) {
    this.roadmapData.items.push(item);
  }

  updateStatus() {
    let itemFound = false;
    this.roadmapData.items.forEach((item) => {
      item.path = this.cleanRelativePath(item.path);
      if (item.path.includes(this.router.url)) {
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

  cleanRelativePath(pathList) {
    const cleanedList = [];
    let cleanedPath;
    pathList.forEach((path) => {
      cleanedPath = path.replace(/\./g, '');
      cleanedList.push(cleanedPath);
    });
    return cleanedList;
  }

}
