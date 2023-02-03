import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';

import { ProgressTrackerModalComponent } from './progress-tracker-modal.component';
import { ProgressTrackerUtil } from './progress-tracker-util';
import { IProgressTrackerData } from './progress-tracker.types';

@Injectable({
    providedIn: 'root'
})
export class ProgressTrackerService {
    isModalOpen = false;
    private data: IProgressTrackerData;
    private subject: BehaviorSubject<IProgressTrackerData> = new BehaviorSubject<
        IProgressTrackerData
    >({} as IProgressTrackerData);
    private changeListener = new Subject();
    private modelRef: NgbModalRef;

    constructor(private modal: NgbModal, private router: Router) { }

    public show() {
        if (!this.isModalOpen) {
            this.refresh();
            this.modelRef = this.modal.open(ProgressTrackerModalComponent, {
                windowClass: 'progress-tracker-modal',
                backdropClass: 'progress-tracker-backdrop'
            });
            this.isModalOpen = true;
        } else {
            this.hide();
        }
    }

    public hide() {
        if (this.modelRef) {
            this.modelRef.close();
            this.isModalOpen = false;
        }
    }

    public isReadOnly(): boolean {
        return this.data.properties.readOnly || false;
    }

    setReadOnly(readOnly: boolean) {
        this.data.properties.readOnly = readOnly;
        this.subject.next(this.data);
    }

    public setProgressTrackerData(data: IProgressTrackerData) {
        this.data = data;
        this.subject.next(this.data);
    }

    public getProgressTrackerData() {
        return this.subject.asObservable();
    }

    public updateValue(path: string, value: any): void {
        this.data.items.forEach((item) => {
            item.subItems.forEach((subItem) => {
                if (ProgressTrackerUtil.compare(path, subItem.path)) {
                    subItem.value = value;
                    subItem.completed = true;
                }
            });
        });
        this.subject.next(this.data);
    }

    public updateList(path: string, list: any): void {
        this.data.items.forEach((item) => {
            item.subItems.forEach((subItem) => {
                if (ProgressTrackerUtil.compare(path, subItem.path)) {
                    subItem.list = list;
                    subItem.completed = true;
                }
            });
        });
        this.subject.next(this.data);
    }

    /**
     * Refresh the progress tracker UI.
     *
     * @memberof ProgressTrackerService
     */
    refresh(): void {
        this.subject.next(this.data);
    }

    navigate(path: string): void {
        this.router.navigate([path]);
    }
}