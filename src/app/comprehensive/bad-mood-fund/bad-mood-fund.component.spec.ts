import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadMoodFundComponent } from './bad-mood-fund.component';

describe('BadMoodFundComponent', () => {
  let component: BadMoodFundComponent;
  let fixture: ComponentFixture<BadMoodFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadMoodFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadMoodFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
