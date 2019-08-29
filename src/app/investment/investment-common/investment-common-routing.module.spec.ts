import { InvestmentCommonRoutingModule } from './investment-common-routing.module';

describe('InvestmentCommonRoutingModule', () => {
  let investmentCommonRoutingModule: InvestmentCommonRoutingModule;

  beforeEach(() => {
    investmentCommonRoutingModule = new InvestmentCommonRoutingModule();
  });

  it('should create an instance', () => {
    expect(investmentCommonRoutingModule).toBeTruthy();
  });
});
