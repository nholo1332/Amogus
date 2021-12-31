import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {rankingsDisplayDialogData} from '../dialogData';
import Player from '../../models/player';

@Component({
  selector: 'app-rankings-display-dialog',
  templateUrl: './rankings-display-dialog.component.html',
  styleUrls: ['./rankings-display-dialog.component.scss'],
})
export class RankingsDisplayDialogComponent implements OnInit {

  players: Player[] = [];

  constructor(public dialogRef: MatDialogRef<RankingsDisplayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: rankingsDisplayDialogData) {
    this.players = data.game.players.sort((a, b) => ( data.game.leaderboard.get(b.uid) ?? 0 ) - ( data.game.leaderboard.get(a.uid) ?? 0 ));
  }

  ngOnInit(): void {
  }

  getPlacing(index: number): string {
    switch ( index + 1 ) {
      case 1:
        return 'filter_1';
      case 2:
        return 'filter_2';
      case 3:
        return 'filter_3';
      default:
        return '';
    }
  }

}
