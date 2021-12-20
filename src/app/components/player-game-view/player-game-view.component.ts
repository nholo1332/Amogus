import {Component, Input, OnInit} from '@angular/core';
import Game from '../../models/game';

@Component({
  selector: 'app-player-game-view',
  templateUrl: './player-game-view.component.html',
  styleUrls: ['./player-game-view.component.scss'],
})
export class PlayerGameViewComponent implements OnInit {

  @Input() game: Game = new Game();
  @Input() gameKey: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

}
