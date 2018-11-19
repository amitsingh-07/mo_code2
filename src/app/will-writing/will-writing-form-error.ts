export class WillWritingFormError {
        aboutMeForm: object = {
                formFieldErrors: {
                        errorTitle: 'Oops! Please enter the following details:',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        uin: {
                                required: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage: 'Identification Number'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
                                }
                        },
                        gender: {
                                required: {
                                        errorTitle: 'Invalid Gender',
                                        errorMessage: 'Gender'
                                }
                        },
                        maritalStatus: {
                                required: {
                                        errorTitle: 'Invalid Marital Status',
                                        errorMessage: 'Marital status'
                                }
                        },
                        noOfChildren: {
                                required: {
                                        errorTitle: 'Invalid Child Count',
                                        errorMessage: 'Number of Children'
                                }
                        }
                }
        };
        myFamilyForm: object = {
                formFieldErrors: {
                        errorTitle: 'Oops! Please enter the following details:',
                        spouse: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage: 'Identification Number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
                                        }
                                }
                        },
                        children: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage: 'Identification Number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
                                        }
                                },
                                dob: {
                                        required: {
                                                errorTitle: 'Invalid Date of Birth',
                                                errorMessage: 'Date of Birth'
                                        }
                                }
                        }
                }
        };
        guardBeneForm: object = {
                formFieldErrors: {
                        errorTitle: 'Oops! Please enter the following details:',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                }
                        },
                        uin: {
                                required: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage: 'Identification Number'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Identification Number',
                                        errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
                                }
                        },
                        relationship: {
                                required: {
                                        errorTitle: 'Invalid Relationship',
                                        errorMessage: 'Relationship to you'
                                }
                        }
                }
        };
        addExecTrusteeForm: object = {
                formFieldErrors: {
                        errorTitle: 'Oops! Please enter the following details:',
                        executorTrustee: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Name field can only contain alphabets value of 2 - 40 characters in length'
                                        }
                                },
                                uin: {
                                        required: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage: 'Identification Number'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Identification Number',
                                                errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
                                        }
                                },
                                relationship: {
                                        required: {
                                                errorTitle: 'Invalid Relationship',
                                                errorMessage: 'Relationship to you'
                                        }
                                }
                        }
                }
        };
}
