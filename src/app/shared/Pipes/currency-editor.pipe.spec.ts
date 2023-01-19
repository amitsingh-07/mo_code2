import { CurrencyPipe } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { CurrencyEditorPipe } from './currency-editor.pipe';

describe('CurrencyEditorPipe', () => {
  let currencyPipe: CurrencyPipe;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CurrencyPipe
      ],
    }).compileComponents();
  }));

  it('create an instance', () => {
    const pipe = new CurrencyEditorPipe(currencyPipe);
    expect(pipe).toBeTruthy();
  });
});
