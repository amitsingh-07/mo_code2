import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanicalDetailsComponent } from './finanical-details.component';

describe('FinanicalDetailsComponent', () => {
  let component: FinanicalDetailsComponent;
  let fixture: ComponentFixture<FinanicalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanicalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
