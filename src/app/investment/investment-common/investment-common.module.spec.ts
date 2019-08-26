import { InvestmentCommonodule } from './investment-common.module';

describe('GuideMeModule', () => {
  let investmentCommonodule: InvestmentCommonodule;

  beforeEach(() => {
    investmentCommonodule = new InvestmentCommonodule();
  });

  it('should create an instance', () => {
    expect(investmentCommonodule).toBeTruthy();
  });
});
