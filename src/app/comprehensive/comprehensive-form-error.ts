export class ComprehensiveFormError {
    invalidName = 'Invalid Name';
    errorTitleDetails = 'Oops! Please enter the following details:';
    invalidMortgageAmount = 'Invalid Mortgage Payment using CPF';
    InvalidPayOff = 'Invalid To Pay Off';
    invalidNameCharacters = 'Full Name should be 2 - 100 characters long';

    moGetStrdForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
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
            errorTitle: this.errorTitleDetails,
            name: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Name'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: this.invalidNameCharacters
                },
                minlength: {
                    errorTitle: this.invalidName,
                    errorMessage: this.invalidNameCharacters
                },
                maxlength: {
                    errorTitle: this.invalidName,
                    errorMessage: this.invalidNameCharacters
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
    educationPreferenceForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
            location: {
                required: {
                    errorTitle: 'Invalid Location',
                    errorMessage: 'Location'
                }
            },
            educationCourse: {
                required: {
                    errorTitle: 'Invalid Course',
                    errorMessage: 'Course'
                }
            },
        }
    };
    myLiabilitiesForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
            homeLoanOutstandingAmount: {
                required: {
                    errorTitle: 'Invalid Home Loan Outstanding',
                    errorMessage: 'Home Loan Outstanding'
                }
            },
            otherPropertyLoanOutstandingAmount: {
                required: {
                    errorTitle: 'Invalid Other Property Loans',
                    errorMessage: 'Other Property Loans'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Other Property Loans'
                }
            },
            otherLoanOutstandingAmount: {
                required: {
                    errorTitle: 'Invalid Other Loans Amount Outstanding',
                    errorMessage: 'Other Loans Amount Outstanding'
                }
            },
            carLoansAmount: {
                required: {
                    errorTitle: 'Invalid Car Loans',
                    errorMessage: 'Car Loans'
                }
            }

        }
    };
    hospitalPlanForm: object = {
        formFieldErrors: {
            errorTitle: 'Select the hospital Plan',
            hospitalPlanId: {
                required: {
                    errorTitle: 'Please Select the hospital Plan',
                    errorMessage: 'Please Select the hospital Plan'
                }
            },
        }
    };
    myEarningsForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
            employmentType: {
                required: {
                    errorTitle: 'Invalid Employment Type',
                    errorMessage: 'Employment Type'
                }
            },
            monthlySalary: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Other Monthly Salary'
                }
            },
            monthlyRentalIncome: {
                required: {
                    errorTitle: 'Invalid Monthly Rental Income',
                    errorMessage: 'Monthly Rental Income'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Monthly Rental Income'
                }
            },
            otherMonthlyWorkIncome: {
                required: {
                    errorTitle: 'Invalid Other Monthly Work Income',
                    errorMessage: 'Other Monthly Work Income'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Other Monthly Work Income'
                }
            },
            otherMonthlyIncome: {
                required: {
                    errorTitle: 'Invalid Other Monthly Income',
                    errorMessage: 'Other Monthly Income'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Other Monthly Income'
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
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Annual Dividends'
                }
            },
            otherAnnualIncome: {
                required: {
                    errorTitle: 'Invalid Other Annual Income',
                    errorMessage: 'Other Annual Income'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Other Annual Income'
                }
            }

        }
    };
    mySpendingsForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
            monthlyLivingExpenses: {
                required: {
                    errorTitle: 'Invalid Monthly Living Expenses',
                    errorMessage: 'Monthly Living Expenses'
                }
            },
            adHocExpenses: {
                required: {
                    errorTitle: 'Invalid Yearly or Ad-Hoc Expenses',
                    errorMessage: 'Other Yearly or Ad-Hoc Expenses'
                }
            },
            HLMortgagePaymentUsingCPF: {
                required: {
                    errorTitle: this.invalidMortgageAmount,
                    errorMessage: 'Mortgage Payment using CPF'
                }
            },
            HLMortgagePaymentUsingCash: {
                required: {
                    errorTitle: 'Invalid Other Mortgage Payment using Cash',
                    errorMessage: 'Other Mortgage Payment using Cash'
                }
            },
            HLtypeOfHome: {
                required: {
                    errorTitle: 'Invalid Type of Home',
                    errorMessage: 'Other Type of Home'
                }
            },
            homeLoanPayOffUntil: {
                required: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Mortgage Payment - To Pay Off'
                },
                pattern: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Mortgage Payment - Invalid To Pay Off'
                }
            },
            mortgagePaymentUsingCPF: {
                required: {
                    errorTitle: this.invalidMortgageAmount,
                    errorMessage: 'Mortgage Payment using CPF'
                },
                pattern: {
                    errorTitle: this.invalidMortgageAmount,
                    errorMessage: this.invalidMortgageAmount
                }
            },
            mortgagePaymentUsingCash: {
                required: {
                    errorTitle: 'Invalid Other Mortgage Payment using Cash',
                    errorMessage: 'Other Mortgage Payment using Cash'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Mortgage Payment using Cash'
                }
            },
            mortgageTypeOfHome: {
                required: {
                    errorTitle: 'Invalid Type of Home',
                    errorMessage: 'Other Type of Home'
                }
            },
            mortgagePayOffUntil: {
                required: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Other Mortgage Payment - Invalid To Pay Off'
                },
                pattern: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Other Mortgage Payment - Invalid To Pay Off'
                }
            },
            carLoanPayment: {
                required: {
                    errorTitle: 'Invalid Monthly Car Loan Payment',
                    errorMessage: 'Monthly Car Loan Payment'
                }
            },
            otherLoanPayment: {
                required: {
                    errorTitle: 'Invalid Monthly Other Loan Payment',
                    errorMessage: 'Monthly Other Loan Payment'
                }
            },
            otherLoanPayoffUntil: {
                required: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Monthly Other Loan Payment - Invalid To Pay Off'
                },
                pattern: {
                    errorTitle: this.InvalidPayOff,
                    errorMessage: 'Monthly Other Loan Payment - Invalid To Pay Off'
                }
            }

        }
    };

    RSPForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the Regular Savings Plan  details:',
            regularUnitTrust: {
                required: {
                    errorTitle: 'Invalid Unit Trust Type',
                    errorMessage: 'Unit Trust Type'
                }
            },
            regularPaidByCash: {
                required: {
                    errorTitle: 'Invalid Paid By Cash',
                    errorMessage: 'Paid By Cash'
                }
            },
            regularPaidByCPF: {
                required: {
                    errorTitle: 'Invalid Payment using CPF',
                    errorMessage: 'Regular Paid By CPF'
                }
            },
        }
    };
    myAssetsForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            investmentPropertiesValue: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Investment Properties'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Investment Properties'
                }
            },
            typeOfInvestment: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Select Investment Type'
                },
            },
            investmentAmount: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'others'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Others'
                }
            },
            assetsInvestmentSet: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Other Investment'
                },
            }
        }
    };
    endowmentListForm: object = {
        formFieldErrors: {
            errorTitle: this.errorTitleDetails,
            endowmentMaturityAmount: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Maturity Amount'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Maturity Amount'
                }
            },
            endowmentMaturityYears: {
                required: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Maturity Year'
                },
                pattern: {
                    errorTitle: this.invalidName,
                    errorMessage: 'Invalid Maturity Year'
                }
            },
        }
    };
}
