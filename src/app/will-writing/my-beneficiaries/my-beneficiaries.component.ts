import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-beneficiaries',
  templateUrl: './my-beneficiaries.component.html',
  styleUrls: ['./my-beneficiaries.component.scss']
})
export class MyBeneficiariesComponent implements OnInit {
  familyDetails = [
    {name: 'vetri', relation: 'My Spouse' },
    {name: 'vetri1', relation: 'My Child 1'},
    {name: 'vetri2', relation: 'My Child 2'}];
  addBeneficiaryForm: FormGroup;
  relationshipList;
  relationship = '';
  isOpen = false;
  constructor(private translate: TranslateService, private formBuilder: FormBuilder) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.relationshipList = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.FORM.RELATIONSHIP_LIST');
    });
   }

  ngOnInit() {
    this.addBeneficiaryForm = this.formBuilder.group({
      name: ['', Validators.required],
      nricNumber: ['', Validators.required],
      relation : ['', Validators.required]
    });
  }
  selectRelationship(relationship) {
    relationship = relationship ? relationship : {text: '', value: ''};
    this.relationship = relationship.text;
    this.addBeneficiaryForm.controls['relation'].setValue(relationship.value);
  }
  addBeneficiary(form) {
    console.log(form);
    this.familyDetails.push(form);
    this.addBeneficiaryForm.reset();
  }

}
