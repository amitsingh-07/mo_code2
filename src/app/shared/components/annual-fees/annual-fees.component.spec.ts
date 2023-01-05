import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnualFeesComponent } from './annual-fees.component';

describe('AnnualFeesComponent', () => {
  let component: AnnualFeesComponent;
  let fixture: ComponentFixture<AnnualFeesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
