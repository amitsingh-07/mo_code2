import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsureLinkComponent } from './insure-link.component';

describe('InsureLinkComponent', () => {
  let component: InsureLinkComponent;
  let fixture: ComponentFixture<InsureLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsureLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsureLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
