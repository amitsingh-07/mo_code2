import { HostListener, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { ConfirmationModalComponent } from './shared/modal/confirmation-modal/confirmation-modal.component';

export interface IComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<IComponentCanDeactivate> {

    constructor(private modalService: NgbModal) { }

    @HostListener('window:beforeunload')
    canDeactivate(component: IComponentCanDeactivate): boolean | Observable<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first
        return component.canDeactivate() ?
            true : this.openConfirmDialog();
    }

    openConfirmDialog() {
        const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
        return modalRef.componentInstance.onClose.map((result) => {
            return result;
        });
    }
}
