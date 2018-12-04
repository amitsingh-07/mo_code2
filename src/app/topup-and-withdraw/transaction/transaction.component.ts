import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { GroupByPipe } from '../../shared/Pipes/group-by.pipe';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
  pageTitle: string;
  transactionHistory: any;
  accountCreationDate: any;
  statementMonthsList: any;
  Object = Object;
  activeTransactionIndex;

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private topupAndWithDrawService: TopupAndWithDrawService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Transaction';
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.topupAndWithDrawService.getAllTransactionHistory().subscribe((response) => {
      let mockresponse = {
        "objectList": [{
            "id": 2,
            "fundInvestmentSplits": [{
              "id": 12,
              "fund": {
                "id": 1,
                "name": "Fidelity ASEAN A SGD",
                "fundId": "FI3018",
                "factSheetLink": "FI3018-FS.pdf|FI3018-P.pdf",
                "type": {
                  "id": 1,
                  "type": "UT"
                },
                "sector": {
                  "id": 1,
                  "name": "Emerging Markets Equity",
                  "sectorId": "SECTOR00012",
                  "type": {
                    "id": 1,
                    "type": "Equities"
                  },
                  "riskRating": 9.0
                }
              },
              "unit": null,
              "unitPrice": 100.0
            }, {
              "id": 11,
              "fund": null,
              "unit": null,
              "unitPrice": 100.0
            }],
            "customer": null,
            "amount": 100.0,
            "portfolio": {
              "id": 2,
              "name": "Test BFA DPMS 2",
              "portfolioId": "PORTFOLIO00058",
              "projectedReturns": "+ 5.50%"
            },
            "paymentMode": {
              "id": 66,
              "name": "Cash Account",
              "value": "Trust Account",
              "key": "CASH-ACCOUNT"
            },
            "transactionType": {
              "id": 68,
              "name": "Sell",
              "value": "Sell",
              "key": "SELL"
            },
            "paymentMethod": {
              "id": 70,
              "name": "Cheque",
              "value": "cheque",
              "key": "CHEQUE"
            },
            "contractNo": "SDCON181129000003",
            "transactionStatus": {
              "id": 74,
              "name": "Received",
              "value": "received",
              "key": "RECEIVED"
            },
            "currency": {
              "id": 76,
              "name": "SGD",
              "value": "SGD",
              "key": "SGD"
            },
            "costSGD": 100.0,
            "conversionRate": 1.0,
            "voidReason": null,
            "transactionCreatedDate": 1543832069000,
            "transactionCompletedDate": null,
            "createdBy": null,
            "lastUpdatedTimeStamp": 1543832069000,
            "createdDate": 1543832069000,
            "displayCreatedDate": "3 December 2018",
            "transactionDate": 1543832069000
          },
      
          {
            "id": 2,
            "fundInvestmentSplits": [{
              "id": 12,
              "fund": {
                "id": 1,
                "name": "Fidelity ASEAN A SGD",
                "fundId": "FI3018",
                "factSheetLink": "FI3018-FS.pdf|FI3018-P.pdf",
                "type": {
                  "id": 1,
                  "type": "UT"
                },
                "sector": {
                  "id": 1,
                  "name": "Emerging Markets Equity",
                  "sectorId": "SECTOR00012",
                  "type": {
                    "id": 1,
                    "type": "Equities"
                  },
                  "riskRating": 9.0
                }
              },
              "unit": null,
              "unitPrice": 100.0
            }, {
              "id": 11,
              "fund": null,
              "unit": null,
              "unitPrice": 100.0
            }],
            "customer": null,
            "amount": 100.0,
            "portfolio": {
              "id": 2,
              "name": "Test BFA DPMS 2",
              "portfolioId": "PORTFOLIO00058",
              "projectedReturns": "+ 5.50%"
            },
            "paymentMode": {
              "id": 66,
              "name": "Cash Account",
              "value": "Trust Account",
              "key": "CASH-ACCOUNT"
            },
            "transactionType": {
              "id": 68,
              "name": "Sell",
              "value": "Sell",
              "key": "SELL"
            },
            "paymentMethod": {
              "id": 70,
              "name": "Cheque",
              "value": "cheque",
              "key": "CHEQUE"
            },
            "contractNo": "SDCON181129000003",
            "transactionStatus": {
              "id": 74,
              "name": "Received",
              "value": "received",
              "key": "RECEIVED"
            },
            "currency": {
              "id": 76,
              "name": "SGD",
              "value": "SGD",
              "key": "SGD"
            },
            "costSGD": 100.0,
            "conversionRate": 1.0,
            "voidReason": null,
            "transactionCreatedDate": 1543832069000,
            "transactionCompletedDate": null,
            "createdBy": null,
            "lastUpdatedTimeStamp": 1543832069000,
            "createdDate": 1543832069000,
            "displayCreatedDate": "3 December 2018",
            "transactionDate": 1543832069000
          }
      
          ,
      
          {
            "id": 2,
            "fundInvestmentSplits": [{
              "id": 12,
              "fund": {
                "id": 1,
                "name": "Fidelity ASEAN A SGD",
                "fundId": "FI3018",
                "factSheetLink": "FI3018-FS.pdf|FI3018-P.pdf",
                "type": {
                  "id": 1,
                  "type": "UT"
                },
                "sector": {
                  "id": 1,
                  "name": "Emerging Markets Equity",
                  "sectorId": "SECTOR00012",
                  "type": {
                    "id": 1,
                    "type": "Equities"
                  },
                  "riskRating": 9.0
                }
              },
              "unit": null,
              "unitPrice": 100.0
            }, {
              "id": 11,
              "fund": null,
              "unit": null,
              "unitPrice": 100.0
            }],
            "customer": null,
            "amount": 100.0,
            "portfolio": {
              "id": 2,
              "name": "Test BFA DPMS 2",
              "portfolioId": "PORTFOLIO00058",
              "projectedReturns": "+ 5.50%"
            },
            "paymentMode": {
              "id": 66,
              "name": "Cash Account",
              "value": "Trust Account",
              "key": "CASH-ACCOUNT"
            },
            "transactionType": {
              "id": 68,
              "name": "Sell",
              "value": "Sell",
              "key": "SELL"
            },
            "paymentMethod": {
              "id": 70,
              "name": "Cheque",
              "value": "cheque",
              "key": "CHEQUE"
            },
            "contractNo": "SDCON181129000003",
            "transactionStatus": {
              "id": 74,
              "name": "Received",
              "value": "received",
              "key": "RECEIVED"
            },
            "currency": {
              "id": 76,
              "name": "SGD",
              "value": "SGD",
              "key": "SGD"
            },
            "costSGD": 100.0,
            "conversionRate": 1.0,
            "voidReason": null,
            "transactionCreatedDate": 1543832069000,
            "transactionCompletedDate": null,
            "createdBy": null,
            "lastUpdatedTimeStamp": 1543832069000,
            "createdDate": 1543832069000,
            "displayCreatedDate": "21 August 2018",
            "transactionDate": 1543832069000
          }
        ],
        "responseMessage": {
          "responseCode": 6000,
          "responseDescription": "Successful response"
        }
      };
      this.transactionHistory = response.objectList;
      this.transactionHistory = new GroupByPipe().transform(this.transactionHistory, 'displayCreatedDate');
    });

    // Statement
    this.accountCreationDate = new Date('2016-04-23');
    this.statementMonthsList = this.topupAndWithDrawService.getMonthListByPeriod(this.accountCreationDate, new Date());
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title, null, false, false, true);
  }

  getStatementLink(month) {
    const base_url = TOPUPANDWITHDRAW_CONFIG.STATEMENT.STATEMENT_BASE_PATH;
    const customerId = 'ngvdkf'; // todo
    const sub_path = 'statements/' + customerId + '/';
    const fileName = month.monthName.substring(0, 3).toLowerCase() + '_' + month.year + '.pdf';
    return base_url + sub_path + fileName ;
  }

  expandCollapseAccordion(groupIndex, transactionIndex) {
    const index = groupIndex.toString() + transactionIndex.toString();
    if (index !== this.activeTransactionIndex) {
      this.activeTransactionIndex = index;
    } else {
      this.activeTransactionIndex = null;
    }
  }

}