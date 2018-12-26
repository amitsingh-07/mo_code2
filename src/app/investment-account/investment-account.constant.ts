export let INVESTMENT_ACCOUNT_CONFIG = {
    SINGAPORE_NATIONALITY_CODE: 'SG',
    SINGAPORE_COUNTRY_CODE: 'SG',
    personal_info: {
        min_age: 18,
        min_passport_expiry: 6 // in months
    },
    residential_info: {
        isMailingAddressSame: true
    },
    employmentDetails: {
        isEmployeAddresSame: true
    },
    upload_documents: {
        default_thumb: 'cam-icon.svg',
        max_file_size: 2, // in MB
        image_file_types: ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP'],
        doc_file_types: ['PDF']
    },
    confirm_portfolio: {
        fees: {
            moneyowl_fees: '0.65%',
            platform_fees: '0.15%',
            fund_expense_ratio: '0.2% to 0.4%',
            total: '1% to 1.2%'
        }
    },
    status: {
        aml_pending: 'PENDING',
        aml_cleared: 'CLEARED',
        aml_accepted : 'ACCEPTED',
        aml_rejected : 'REJECTED',
        aml_failed : 'FAILED',
        ddc_submitted: 'ddc_submitted',
        account_creation_pending: 'account_creation_pending',
        documents_pending: 'documents_pending'
    }
};
