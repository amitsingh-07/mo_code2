import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclarationStep1Component } from './additional-declaration-step1.component';

describe('AdditionalDeclarationStep1Component', () => {
  let component: AdditionalDeclarationStep1Component;
  let fixture: ComponentFixture<AdditionalDeclarationStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclarationStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
