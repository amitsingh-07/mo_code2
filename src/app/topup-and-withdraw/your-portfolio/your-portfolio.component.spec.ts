import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPortfolioComponent } from './your-portfolio.component';

describe('YourPortfolioComponent', () => {
  let component: YourPortfolioComponent;
  let fixture: ComponentFixture<YourPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Top Up content', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#topup_button').textContent).toContain('Total Returns');
  }));

  it('testing the Top Up button', async(() => {
    spyOn(component, 'gotoTopUp');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.gotoTopUp).toHaveBeenCalled();
    });
  }));
});
