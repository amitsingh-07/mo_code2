import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclaration1Component } from './additional-declaration1.component';

describe('AdditionalDeclaration1Component', () => {
  let component: AdditionalDeclaration1Component;
  let fixture: ComponentFixture<AdditionalDeclaration1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclaration1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclaration1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
