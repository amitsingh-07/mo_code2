import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDeclarationSubmitComponent } from './additional-declaration-submit.component';

describe('AdditionalDeclarationSubmitComponent', () => {
  let component: AdditionalDeclarationSubmitComponent;
  let fixture: ComponentFixture<AdditionalDeclarationSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDeclarationSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
