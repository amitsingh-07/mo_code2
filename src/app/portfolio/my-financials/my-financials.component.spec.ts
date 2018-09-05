import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFinancialsComponent } from './my-financials.component';

describe('MyFinancialsComponent', () => {
  let component: MyFinancialsComponent;
  let fixture: ComponentFixture<MyFinancialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFinancialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
