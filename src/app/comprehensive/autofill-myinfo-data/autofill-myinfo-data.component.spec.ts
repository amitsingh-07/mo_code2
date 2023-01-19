import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutofillMyinfoDataComponent } from './autofill-myinfo-data.component';

describe('AutofillMyinfoDataComponent', () => {
  let component: AutofillMyinfoDataComponent;
  let fixture: ComponentFixture<AutofillMyinfoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutofillMyinfoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutofillMyinfoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
