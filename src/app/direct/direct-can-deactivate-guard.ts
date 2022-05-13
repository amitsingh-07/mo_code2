import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ContactFormComponent } from './contact-form/contact-form.component';

interface DirectCanDeactivate {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable()
export class DirectCanDeactivateGuard implements CanDeactivate<DirectCanDeactivate> {

  constructor(private modalService: NgbModal) { }

  canDeactivate(component: DirectCanDeactivate, 
  currentRoute: ActivatedRouteSnapshot, 
  currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    return this.openContactModal();
  }

  async openContactModal(): Promise < any > {
    const customerAction = await this.contactFormModalResponse();
    console.log('customerAction ', customerAction)
    return customerAction;
  }

  contactFormModalResponse() {
    const modalRef = this.modalService.open(ContactFormComponent);
    return modalRef.result;
  }

}