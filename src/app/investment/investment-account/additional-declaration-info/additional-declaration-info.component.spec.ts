import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AdditionalDeclarationInfoComponent } from './additional-declaration-info.component';

describe('AdditionalDeclarationInfoComponent', () => {
  let component: AdditionalDeclarationInfoComponent;
  let fixture: ComponentFixture<AdditionalDeclarationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule.forRoot(), HttpClientTestingModule, HttpModule,
      JwtModule.forRoot({config: {}})],
      declarations: [ AdditionalDeclarationInfoComponent ],
      providers: [ JwtHelperService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdditionalDeclarationInfoComponent', () => {
    expect(component).toBeTruthy();
  });
});
