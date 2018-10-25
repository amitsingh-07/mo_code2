export class WillWritingFormError {
        aboutMeForm: object = {
                formFieldErrors: {
                        errorTitle: 'Invalid Form',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Please enter your name'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        uin: {
                                required: {
                                        errorTitle: 'Invalid NRCI Number',
                                        errorMessage: 'Please enter your NRCI number'
                                },
                                pattern: {
                                        errorTitle: 'Invalid NRCI Number',
                                        errorMessage: 'NRIC field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        gender: {
                                required: {
                                        errorTitle: 'Invalid Gender',
                                        errorMessage: 'Please select your gender'
                                }
                        },
                        maritalStatus: {
                                required: {
                                        errorTitle: 'Invalid Marital Status',
                                        errorMessage: 'Please select your marital status'
                                }
                        },
                        noOfChildren: {
                                required: {
                                        errorTitle: 'Invalid Child Count',
                                        errorMessage: 'Please select your child count'
                                }
                        }
                }
        };
        myFamilyForm: object = {
                formFieldErrors: {
                        errorTitle: 'Invalid Form',
                        spouse: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Please enter your spouse name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid First Name',
                                                errorMessage: 'First name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid NRCI Number',
                                                errorMessage: 'Please enter your spouse NRCI number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid NRCI Number',
                                                errorMessage: 'NRIC field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                        },
                        childrens: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Please enter your childe name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid First Name',
                                                errorMessage: 'First name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid NRCI Number',
                                                errorMessage: 'Please enter your child NRCI number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid First Name',
                                                errorMessage: 'First name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                dob: {
                                        required: {
                                                errorTitle: 'Invalid Date of Birth',
                                                errorMessage: 'Please select your child date of birth'
                                        }
                                }
                        }
                }
        };
        addGuardianForm: object = {
                formFieldErrors: {
                        errorTitle: 'Invalid Form',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Please input the Name'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        uin: {
                                required: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage: 'Please input Identification Number'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage: 'Identification Number field can contains only alphabets value'
                                }
                        },
                        relationship: {
                                required: {
                                        errorTitle: 'Invalid Relationship',
                                        errorMessage: 'Please indicate relationship to you'
                                }
                        }
                }
        };
        addExecTrusteeForm: object = {
                formFieldErrors: {
                        errorTitle: 'Invalid Form',
                        executorTrustee: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Please input the Name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage: 'Please input Identification Number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage: 'Identification Number field can contains only alphabets value'
                                        }
                                },
                                relationship: {
                                        required: {
                                                errorTitle: 'Invalid Relationship',
                                                errorMessage: 'Please indicate relationship to you'
                                        }
                                }
                        }
                }
        };
        addBeneficiaryForm: object = {
                formFieldErrors: {
                        errorTitle: 'Invalid Form',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Please input the Name'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Beneficiary name field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        uin: {
                                required: {
                                        errorTitle: 'Please input NRIC',
                                        errorMessage: 'Please enter your beneficiary NRCI number'
                                },
                                pattern: {
                                        errorTitle: 'Invalid NRCI Number',
                                        errorMessage: 'Beneficiary NRIC field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        relationship: {
                                required: {
                                        errorTitle: 'Invalid Relation',
                                        errorMessage: 'Please indicate Relationship to you'
                                }
                        }
                }
        };
}
