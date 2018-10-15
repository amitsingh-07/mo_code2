import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeSideComponent } from './subscribe-side.component';

describe('SubscribeSideComponent', () => {
  let component: SubscribeSideComponent;
  let fixture: ComponentFixture<SubscribeSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
