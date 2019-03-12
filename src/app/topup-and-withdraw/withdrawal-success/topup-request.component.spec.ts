import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupRequestComponent } from './topup-request.component';

describe('TopupRequestComponent', () => {
  let component: TopupRequestComponent;
  let fixture: ComponentFixture<TopupRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
