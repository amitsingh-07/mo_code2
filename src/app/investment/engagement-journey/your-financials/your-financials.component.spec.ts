import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourFinancialsComponent } from './your-financials.component';

describe('YourFinancialsComponent', () => {
  let component: YourFinancialsComponent;
  let fixture: ComponentFixture<YourFinancialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourFinancialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
