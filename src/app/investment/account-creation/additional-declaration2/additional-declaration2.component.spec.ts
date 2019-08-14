import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclaration2Component } from './additional-declaration2.component';

describe('AdditionalDeclaration2Component', () => {
  let component: AdditionalDeclaration2Component;
  let fixture: ComponentFixture<AdditionalDeclaration2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclaration2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclaration2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
