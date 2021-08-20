import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsNeededComponent } from './years-needed.component';

describe('YearsNeededComponent', () => {
  let component: YearsNeededComponent;
  let fixture: ComponentFixture<YearsNeededComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearsNeededComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
