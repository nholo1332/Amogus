import {Component, OnInit} from '@angular/core';
import DatabaseProvider from '../../providers/databaseProvider';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit {

  gameKey = '';
  loading = false;

  constructor(private db: DatabaseProvider) {
  }

  ngOnInit(): void {
  }

}
