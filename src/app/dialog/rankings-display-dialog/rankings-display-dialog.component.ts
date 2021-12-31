import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {rankingsDisplayDialogData} from '../dialogData';

@Component({
  selector: 'app-rankings-display-dialog',
  templateUrl: './rankings-display-dialog.component.html',
  styleUrls: ['./rankings-display-dialog.component.scss'],
})
export class RankingsDisplayDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RankingsDisplayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: rankingsDisplayDialogData) {
  }

  ngOnInit(): void {
  }

}
