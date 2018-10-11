export class WillWritingFormError {
    aboutMeForm: object = {
        formFieldErrors: {
                errorTitle: 'Invalid Form',
                name: {
                        required : {
                                errorTitle: 'Invalid Name',
                                errorMessage: 'Please enter your name'
                        }
                },
                nricNumber: {
                        required : {
                                errorTitle: 'Invalid NRCI Number',
                                errorMessage: 'Please enter your NRCI number'
                        }
                },
                gender: {
                        required : {
                                errorTitle: 'Invalid Gender',
                                errorMessage: 'Please select your gender'
                        }
                },
                maritalStatus: {
                        required : {
                                errorTitle: 'Invalid Marital Status',
                                errorMessage: 'Please select your marital status'
                        }
                },
                noOfChildren: {
                        required : {
                                errorTitle: 'Invalid Child Count',
                                errorMessage: 'Please select your child count'
                        }
                }
        }
   };
}
