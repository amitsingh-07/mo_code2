import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualFeesComponent } from './annual-fees.component';

describe('AnnualFeesComponent', () => {
  let component: AnnualFeesComponent;
  let fixture: ComponentFixture<AnnualFeesComponent>;

  beforeEach(async(() => {
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
