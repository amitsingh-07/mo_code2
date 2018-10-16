import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEstateDistributionComponent } from './my-estate-distribution.component';

describe('MyEstateDistributionComponent', () => {
  let component: MyEstateDistributionComponent;
  let fixture: ComponentFixture<MyEstateDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEstateDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEstateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
