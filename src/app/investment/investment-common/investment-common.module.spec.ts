import { InvestmentCommonModule } from './investment-common.module';

describe('GuideMeModule', () => {
  let investmentCommonModule: InvestmentCommonModule;

  beforeEach(() => {
    investmentCommonModule = new InvestmentCommonModule();
  });

  it('should create an instance', () => {
    expect(investmentCommonModule).toBeTruthy();
  });
});
