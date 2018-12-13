import { ViewContainerRef } from '@angular/core';

export class DirectState {
    container: ViewContainerRef;
    isMobileView = false;
    modalFreeze: boolean;
    pageTitle: string;
    showingResults = false;
    hideForm = false;
    components = [];
}
