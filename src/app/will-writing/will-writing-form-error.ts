export class WillWritingFormError {
        aboutMeForm: object = {
                formFieldErrors: {
                        errorTitle: 'Oops! Please enter the following details:',
                        name: {
                                required: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name (as per ID)'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name - invalid characters'
                                },
                                minlength: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name should be 2 - 100 characters long'
                                },
                                maxlength: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name should be 2 - 100 characters long'
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
                                                'Identification Number should contain  9 alphanumeric characters'
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
                                                errorMessage: 'Full Name (as per ID)'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name - invalid characters'
                                        },
                                        minlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
                                        },
                                        maxlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
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
                                                'Identification Number should contain  9 alphanumeric characters'
                                        }
                                }
                        },
                        children: {
                                name: {
                                        required: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name (as per ID)'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name - invalid characters'
                                        },
                                        minlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
                                        },
                                        maxlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
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
                                                'Identification Number should contain  9 alphanumeric characters'
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
                                        errorMessage: 'Full Name (as per ID)'
                                },
                                pattern: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name - invalid characters'
                                },
                                minlength: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name should be 2 - 100 characters long'
                                },
                                maxlength: {
                                        errorTitle: 'Invalid Name',
                                        errorMessage: 'Full Name should be 2 - 100 characters long'
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
                                                'Identification Number should contain  9 alphanumeric characters'
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
                                                errorMessage: 'Full Name (as per ID)'
                                        },
                                        pattern: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name - invalid characters'
                                        },
                                        minlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
                                        },
                                        maxlength: {
                                                errorTitle: 'Invalid Name',
                                                errorMessage: 'Full Name should be 2 - 100 characters long'
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
                                                'Identification Number should contain  9 alphanumeric characters'
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
