export class ComprehensiveFormError {
    invalidName = 'Invalid Name';
    moGetStrdForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            gender: {
                required: {
                    errorTitle: 'Invalid Gender',
                    errorMessage: 'Gender'
                }
            },
            ngbDob: {
                required: {
                    errorTitle: 'Invalid Date of Birth',
                    errorMessage: 'Date of Birth'
                }
            },
            nation: {
                required: {
                    errorTitle: 'Invalid Nationality',
                    errorMessage: 'Nationality'
                }
            },
            firstName: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Full Name (as per ID)'
                }
            }

        }
    };
    dependantForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            name: {
                required: {
                        errorTitle: this.invalidName,
                        errorMessage: 'Full Name (as per ID)'
                },
                pattern: {
                        errorTitle:  this.invalidName,
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Full Name - invalid characters. <br>Valid characters: a-z, A-Z, space and !"#$%&\'()*+,-./:;<=>?@[\\\]^_`{|}~'
                },
                minlength: {
                        errorTitle:  this.invalidName,
                        errorMessage: 'Full Name should be 2 - 100 characters long'
                },
                maxlength: {
                        errorTitle:  this.invalidName,
                        errorMessage: 'Full Name should be 2 - 100 characters long'
                }
        },
            gender: {
                required: {
                    errorTitle: 'Invalid Gender',
                    errorMessage: 'Gender'
                }
            },
            dateOfBirth: {
                required: {
                    errorTitle: 'Invalid Date of Birth',
                    errorMessage: 'Date of Birth'
                }
            },
            nation: {
                required: {
                    errorTitle: 'Invalid Nationality',
                    errorMessage: 'Nationality'
                }
            },
            relationship: {
                required: {
                    errorTitle: 'Invalid Relationship',
                    errorMessage: 'Relationship'
                }
            }

        }
    };
     myLiabilitiesForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            homeLoanOutstanding: {
                required: {
                    errorTitle: 'Invalid Home Loan Outstanding',
                    errorMessage: 'Home Loan Outstanding'
                }
            },
            otherPropertyLoan: {
                required: {
                    errorTitle: 'Invalid Other Property Loans',
                    errorMessage: 'Other Property Loans'
                }
            },
            otherLoanAmountOustanding: {
                required: {
                    errorTitle: 'Invalid Other Loans Amount Oustanding',
                    errorMessage: 'Other Loans Amount Oustanding'
                }
            },
            carLoan: {
                required: {
                    errorTitle: 'Invalid Car Loans',
                    errorMessage: 'Car Loans'
                }
            }

        }
    };

    myEarningsForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            employmentType: {
                required: {
                    errorTitle: 'Invalid Employment Type',
                    errorMessage: 'Employment Type'
                }
            },
            monthlySalary: {
                required: {
                    errorTitle: 'Invalid Monthly Salary',
                    errorMessage: 'Other Monthly Salary'
                }
            },
            monthlyRentalIncome: {
                required: {
                    errorTitle: 'Monthly Rental Income',
                    errorMessage: 'Monthly Rental Income'
                }
            },
            otherMonthlyWorkIncome: {
                required: {
                    errorTitle: 'Invalid Other Monthly Work Income',
                    errorMessage: 'Other Monthly Work Income'
                }
            },
            otherMonthlyIncome: {
                required: {
                    errorTitle: 'Invalid Other Monthly Income',
                    errorMessage: 'Other Monthly Income'
                }
            },
            annualBonus: {
                required: {
                    errorTitle: 'Invalid Annual Bonus',
                    errorMessage: 'Annual Bonus'
                }
            },
            annualDividends: {
                required: {
                    errorTitle: 'Invalid Annual Dividends',
                    errorMessage: 'Annual Dividends'
                }
            },
            otherAnnualIncome: {
                required: {
                    errorTitle: 'Invalid Other Annual Income',
                    errorMessage: 'Other Annual Income'
                }
            }

        }
    };
}
