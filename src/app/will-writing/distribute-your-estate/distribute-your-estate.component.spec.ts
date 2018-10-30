import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeYourEstateComponent } from './distribute-your-estate.component';

describe('DistributeYourEstateComponent', () => {
  let component: DistributeYourEstateComponent;
  let fixture: ComponentFixture<DistributeYourEstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeYourEstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeYourEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
