import { InsureAssessmentRoutingModule } from './insure-assessment-routing.module';

describe('AppRoutingModule', () => {
  let insureAssessmentRoutingModule: InsureAssessmentRoutingModule;

  beforeEach(() => {
    insureAssessmentRoutingModule = new InsureAssessmentRoutingModule();
  });

  it('should create an instance', () => {
    expect(insureAssessmentRoutingModule).toBeTruthy();
  });
});
