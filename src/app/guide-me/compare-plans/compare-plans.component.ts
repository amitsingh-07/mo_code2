import { Component, OnInit } from '@angular/core';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss']
})
export class ComparePlansComponent implements OnInit {
  plansdata: any[] = [];
  data: any;
  constructor(public guideMeService: GuideMeService) {
   }

  ngOnInit() {
    this.plansdata = this.guideMeService.getPlanDetails();
    this.data = {
      "id":"P113",
      "riderId":0,
      "productName":"TM Term Assure",
      "purposeId":1,
      "objectiveId":2,
      "typeId":1,
      "searchCount":0,
      "whyBuy":"I am concerned my family cannot cope financially with the loss of income upon my demise.",
      "payOut":"A lump sum benefit upon death, terminal illness or total and permanent disability (TPD).",
      "underWritting":"Yes",
      "rebate":"Eligible",
      "cashValue":"No",
      "cashPayoutFrequency":"",
      "coverageDuration":"5, 10 years, 11 - 44 years, up to age 85",
      "premiumDuration":"Throughout policy duration",
      "features":"Policy can be renewed.~Option to convert plan into regular premium Whole Life or endowment plan.",
      "productDescription":"This Term policy provides high protection at low cost with death and TI benefits. This policy has the option to convert into a Whole Life or Endowment policy without underwriting. You can also attach optional riders like Critical Illness (CI) to enhance its benefits. You have the you have the flexibility to convert your term plan into either a regular premium whole life or an endowment plan up to the coverage amount of your policy.",
      "status":"Active",
      "brochureLink":null,
      "isAuthorised":true,
      "lastUpdated":"2018-08-28T08:51:17.000+0000",
      "lastUpdatedBy":null,
      "insurer":{
         "id":"TKM",
         "insurerName":"Tokio Marine",
         "logoName":"logo-tokiomarine.png",
         "url":"https://www.tokiomarine.com",
         "lastUpdatedTime":"2017-05-03T07:27:06.000+0000",
         "rating":"",
         "lastUpdatedBy":null
      },
      "premium":{
         "id":"P113",
         "gender":"Female",
         "minimumAge":21,
         "coverageName":"$1,000,000",
         "durationName":"till age 65",
         "premiumTerm":"",
         "savingsDuration":"",
         "retirementPayourAmount":"",
         "retirementPayourDuration":"",
         "premiumAmount":"510",
         "premiumFrequency":"per year",
         "intrestRateOfReturn":"0.00",
         "ranking":1,
         "lastUpdatedDate":"2017-03-26T16:00:00.000+0000",
         "lastUpdatedBy":null
      },
      "promotion":{
         "insurerId":"TKM",
         "thumbnail":"tkm_term_protection.jpg",
         "promoDiscount":"*28% OFF",
         "promoTitle":"28% First Year Annual Premium Discount for TM Term Assure (Extended)",
         "description":"To qualify for the premium discount, you have to sign up for the product during the promotion period and issued by the deadline.",
         "link":"50.jsp",
         "expired": "FALSE",
         "expiredDate": "2018-06-29T15:59:59.000+0000",
         "lastUpdatedTime": "2018-05-25T04:33:28.000+0000",
         "lastUpdatedBy": null
      },
      'authorised': true
   };
  }

}
