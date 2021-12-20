import {Component, Input, OnInit} from '@angular/core';
import Game from '../../models/game';
import {animate, style, transition, trigger} from '@angular/animations';
import Player from '../../models/player';
import firebase from 'firebase/compat';
import User = firebase.User;

@Component({
  selector: 'app-player-role-display',
  templateUrl: './player-role-display.component.html',
  styleUrls: ['./player-role-display.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PlayerRoleDisplayComponent implements OnInit {

  @Input() game: Game = new Game();
  @Input() user: User | undefined = undefined;

  showText = false;
  isImposter = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if ( this.user !== undefined && this.game !== undefined ) {
      this.isImposter = ( this.game.players.find((player) => player.imposter) ?? new Player() ).uid === this.user.uid;
    }
    setTimeout(() => {
      this.showText = true;
    }, 800);
    setTimeout(() => {
      this.showText = false;
    }, 3500);
  }

}
