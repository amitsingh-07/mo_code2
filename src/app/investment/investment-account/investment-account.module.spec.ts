import { InvestmentAccountModule } from './investment-account.module';

describe('IfastAccountModule', () => {
  let investmentAccountModule: InvestmentAccountModule;

  beforeEach(() => {
    investmentAccountModule = new InvestmentAccountModule();
  });

  it('should create an instance', () => {
    expect(investmentAccountModule).toBeTruthy();
  });
});
