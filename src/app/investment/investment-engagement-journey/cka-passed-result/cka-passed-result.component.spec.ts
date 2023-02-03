import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkaPassedResultComponent } from './cka-passed-result.component';

describe('CkaPassedResultComponent', () => {
  let component: CkaPassedResultComponent;
  let fixture: ComponentFixture<CkaPassedResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CkaPassedResultComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkaPassedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
