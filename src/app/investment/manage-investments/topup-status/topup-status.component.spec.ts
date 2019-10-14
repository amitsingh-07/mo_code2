import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupStatusComponent } from './topup-status.component';

describe('TopupStatusComponent', () => {
  let component: TopupStatusComponent;
  let fixture: ComponentFixture<TopupStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
