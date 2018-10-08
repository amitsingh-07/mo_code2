import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FairDealingComponent } from './fair-dealing.component';

describe('FairDealingComponent', () => {
  let component: FairDealingComponent;
  let fixture: ComponentFixture<FairDealingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FairDealingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FairDealingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
