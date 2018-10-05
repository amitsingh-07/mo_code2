export class FormError {
        formFieldErrors: object = {
                gender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Select the gender' }
                },
                dob: {
                        required: {
                                errorTitle: 'Invalid Birth Year',
                                errorMessage: 'Please re-check your entry. You have keyed in an invalid birth year.'
                        }
                },
                premiumWaiver: {
                        required: {
                                errorTitle: 'Invalid Premium Waiver',
                                errorMessage: 'Select premium waiver'
                        }
                },
                childgender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Select the gender' }
                },
                childdob: {
                        required: {
                                errorTitle: 'Invalid Birth Year',
                                errorMessage: 'Please re-check your entry. You have keyed in an invalid birth year.'
                        }
                },
                earlyCI: {
                        required: {
                                errorTitle: 'Invalid Early CI',
                                errorMessage: 'Select Early CI option.'
                        }
                },
                employmentType : {
                        required: { errorTitle: 'Invalid Employment Type', errorMessage: 'Select employment type' }
                },
                smoker: {
                        required: { errorTitle: 'Invalid Smoker', errorMessage: 'Select one option' }
                },
                coverageAmt: {
                        required: { errorTitle: 'Invalid Coverage Amount', errorMessage: 'Select Coverage Amount' }
                },
                duration: {
                        required: { errorTitle: 'Invalid Duration', errorMessage: 'Select Duration' }
                },
                selectedPlan: {
                        required: { errorTitle: 'Invalid Plan Type', errorMessage: 'Select Plan Type' }
                },
                fullOrPartialRider: {
                        required: { errorTitle: 'Invalid Full / Partial Rider', errorMessage: 'Select Yes or No' }
                },
                monthlyPayout: {
                        required: { errorTitle: 'Invalid Monthly Payout', errorMessage: 'Select Monthly Payout' }
                },
                contribution: {
                        required: { errorTitle: 'Invalid Contribution', errorMessage: 'Select Contribution' }
                },
                selectedunivercityEntryAge: {
                        required: { errorTitle: 'Invalid Univercity Entry Age', errorMessage: 'Select Univercity Entry Age' }
                },
                retirementIncome: {
                        required: { errorTitle: 'Invalid Retirement Income', errorMessage: 'Select Retirement Income' }
                },
                payoutAge: {
                        required: { errorTitle: 'Invalid Payout Age', errorMessage: 'Select Payout Age' }
                },
                payoutDuration: {
                        required: { errorTitle: 'Invalid Payout Duration', errorMessage: 'Select Payout Duration' }
                },
                payoutFeature: {
                        required: { errorTitle: 'Invalid Payout Feature', errorMessage: 'Select Payout Feature' }
                },
                payoutStartAge: {
                        required: { errorTitle: 'Invalid Payout Start Age', errorMessage: 'Select Payout Start Age' }
                },
                payoutType: {
                        required: { errorTitle: 'Invalid Payout Type', errorMessage: 'Select Payout Type' }
                }
        };
}
