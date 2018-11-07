export class WillWritingFormError {
        aboutMeForm: object = {
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
                                        errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
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
                                                errorMessage:
                                                        'Identification Number field can contains alphanumeric value of 9 characters in length'
                                        }
                                }
                        },
                        childrens: {
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
                                                errorMessage:
                                                        'Identification Number field can contains alphanumeric value of 9 characters in length'
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
        guardBeneForm: object = {
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
                                        errorMessage:
                                                'Identification Number field can contains alphanumeric value of 9 characters in length'
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
                                                errorMessage:
                                                        'Identification Number field can contains alphanumeric value of 9 characters in length'
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
}
