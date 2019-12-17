import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import {
    ManageInvestmentsService
} from '../../../investment/manage-investments/manage-investments.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesComponent implements OnInit {

  note: any;
  @Input('category') category;

  constructor(
    private manageInvestmentsService: ManageInvestmentsService) {
  }

  ngOnInit() {
    this.manageInvestmentsService.getAllNotes().subscribe((data) => {
      this.note = this.getNoteByCategory(data);
    });
  }

  getNoteByCategory(notesList) {
    let selectedNoteItem = null;
    if (notesList) {
      selectedNoteItem = notesList.filter(
        (note) => note.type.toUpperCase().split('|').indexOf(this.category.toUpperCase()) >= 0
      )[0];
    }
    return selectedNoteItem;
  }

}
