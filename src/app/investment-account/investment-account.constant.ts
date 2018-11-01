export let INVESTMENT_ACCOUNT_CONFIG = {
    SINGAPORE_NATIONALITY_CODE: 'SG',
    personal_info: {},
    residential_info: {
        isMailingAddressSame: true
    },
    employmentDetails: {
        isEmployeAddresSame: true
    },
    upload_documents: {
        default_thumb: 'cam-icon.svg',
        max_file_size: 2, // in MB
        image_file_types: ['PNG', 'JPG', 'JPEG', 'BMP', 'GIF'],
        doc_file_types: ['XLS', 'XLSX', 'PDF', 'DOC', 'DOCX']
    },
    confirm_portfolio: {
        fees: {
            moneyowl_fees: '0.65%',
            platform_fees: '0.15%',
            fund_expense_ratio: '0.2% to 0.4%',
            total: '1% to 1.2%'
        }
    }
};
