import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclarationScreen2Component } from './additional-declaration-screen2.component';

describe('AdditionalDeclarationScreen2Component', () => {
  let component: AdditionalDeclarationScreen2Component;
  let fixture: ComponentFixture<AdditionalDeclarationScreen2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclarationScreen2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationScreen2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
