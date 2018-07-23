import { InsureAssessmentModule } from './insure-assessment.module';

describe('InsureAssessmentModule', () => {
  let insureAssessmentModule: InsureAssessmentModule;

  beforeEach(() => {
    insureAssessmentModule = new InsureAssessmentModule();
  });

  it('should create an instance', () => {
    expect(insureAssessmentModule).toBeTruthy();
  });

});
