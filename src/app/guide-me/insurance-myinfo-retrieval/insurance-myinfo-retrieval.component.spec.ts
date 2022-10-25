import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMyinfoRetrievalComponent } from './insurance-myinfo-retrieval.component';

describe('InsuranceMyinfoRetrievalComponent', () => {
  let component: InsuranceMyinfoRetrievalComponent;
  let fixture: ComponentFixture<InsuranceMyinfoRetrievalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceMyinfoRetrievalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMyinfoRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
