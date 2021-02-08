import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiseincomePayoutComponent } from './wiseincome-payout.component';

describe('WiseincomePayoutComponent', () => {
  let component: WiseincomePayoutComponent;
  let fixture: ComponentFixture<WiseincomePayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiseincomePayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseincomePayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
