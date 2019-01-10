export class FormError {
        formFieldErrors: object = {
                gender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Please select your gender' }
                },
                dob: {
                        required: {
                                errorTitle: 'Invalid Date of Birth',
                                errorMessage: 'You have selected an invalid date of birth. Please check your entry.'
                        }
                },
                premiumWaiver: {
                        required: {
                                errorTitle: 'Invalid Premium Waiver',
                                errorMessage: 'Please select an option.'
                        }
                },
                childgender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Please select your gender' }
                },
                childdob: {
                        required: {
                                errorTitle: 'Invalid Date of Birth',
                                errorMessage: 'You have selected an invalid date of birth. Please check your entry.'
                        }
                },
                earlyCI: {
                        required: {
                                errorTitle: 'Invalid Early CI',
                                errorMessage: 'Please select an option.'
                        }
                },
                employmentType : {
                        required: {
                                errorTitle: 'Invalid Employment Type',
                                errorMessage: 'You have selected an invalid employment type. Please check your entry.'
                        }
                },
                monthlySalary : {
                        required: {
                                errorTitle: 'Invalid Monthly Salary',
                                errorMessage: 'Please enter a number greater than 0.'
                        }
                },
                smoker: {
                        required: { errorTitle: 'Invalid Smoker Status', errorMessage: 'Please select your status' }
                },
                coverageAmt: {
                        required: {
                                errorTitle: 'Invalid Coverage Amount',
                                errorMessage: 'You have selected an invalid coverage amount. Please check your entry.'
                        }
                },
                duration: {
                        required: {
                                errorTitle: 'Invalid Duration',
                                errorMessage: 'You have selected an invalid duration. Please check your entry.'
                        }
                },
                selectedPlan: {
                        required: { errorTitle: 'Invalid Plan Type', errorMessage: 'Please select a hospital plan type' }
                },
                fullOrPartialRider: {
                        required: { errorTitle: 'Invalid Rider Option', errorMessage: 'Please select an option.' }
                },
                monthlyPayout: {
                        required: {
                                errorTitle: 'Invalid Monthly Payout',
                                errorMessage: 'You have selected an invalid monthly payout amount. Please check your entry.'
                        }
                },
                contribution: {
                        required: {
                                errorTitle: 'Invalid Monthly Contribution',
                                errorMessage: 'You have selected an invalid monthly contribution. Please check your entry.'
                        }
                },
                selectedunivercityEntryAge: {
                        required: {
                                errorTitle: 'Invalid Univercity Entry Age',
                                errorMessage: 'You have selected an invalid university entry age. Please check your entry'
                        }
                },
                retirementIncome: {
                        required: {
                                errorTitle: 'Invalid Retirement Income Amount',
                                errorMessage: 'You have selected an invalid retirement income amount. Please check your entry.'
                        }
                },
                payoutAge: {
                        required: {
                                errorTitle: 'Invalid Payout Start Age',
                                errorMessage: 'You have selected an invalid payout start age. Please check your entry.'
                        }
                },
                payoutDuration: {
                        required: {
                                errorTitle: 'Invalid Payout Duration',
                                errorMessage: 'You have selected an invalid payout duration. Please check your entry'
                        }
                },
                payoutFeature: {
                        required: {
                                errorTitle: 'Invalid Payout Feature',
                                errorMessage: 'You have selected an invalid payout feature. Please check your entry.'
                        }
                },
                payoutStartAge: {
                        required: {
                                errorTitle: 'Invalid Payout Start Age',
                                errorMessage: 'You have selected an invalid payout start age. Please check your entry'
                        }
                },
                payoutType: {
                        required: {
                                errorTitle: 'Invalid Payout Type',
                                errorMessage: 'You have selected an invalid payout type. Please check your entry.'
                        }
                },
                singlePremium: {
                        required: {
                                errorTitle: 'Invalid Single Premium Amount',
                                errorMessage: 'Please select a valid single premium amount.'
                        }
                }
        };
}
