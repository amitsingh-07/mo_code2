/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Tooltip2ModalComponent } from './tooltip2-modal.component';

describe('Tooltip2ModalComponent', () => {
  let component: Tooltip2ModalComponent;
  let fixture: ComponentFixture<Tooltip2ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tooltip2ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tooltip2ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
