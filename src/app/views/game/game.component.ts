import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Game from '../../models/game';
import {DatabaseProvider} from '../../providers/databaseProvider';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../services/authServices';
import {GameSubscription} from '../../providers/gameSubscription';
import Player from '../../models/player';
import firebase from 'firebase/compat';
import Question from '../../models/question';
import {animate, style, transition, trigger} from '@angular/animations';
import User = firebase.User;

interface PlayerList {
  left: Player[];
  right: Player[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
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
export class GameComponent implements OnInit {

  loading = true;
  startingGame = false;
  gameKey = '';

  game: Game = new Game();
  players: PlayerList = { left: [], right: [] };
  user: User | undefined = undefined;

  currentRoundQuestion: Question[] = [];

  constructor(private route: ActivatedRoute, private db: DatabaseProvider, private router: Router,
              private snackBar: MatSnackBar, private auth: AuthService, private gameSubscription: GameSubscription) {
    this.gameKey = route.snapshot.paramMap.get('key') ?? '';
    db.isGameJoinable(this.gameKey).then((joinable) => {
      if ( joinable ) {
        return auth.getAuthState();
      } else {
        throw Error('Not joinable.');
      }
    }).then((state) => {
      if ( state !== null ) {
        return state;
      } else {
        snackBar.open('Iniciar sesión con Google', '', {
          duration: 2000,
        });
        return auth.googleSingIn();
      }
    }).then((user) => {
      this.user = user;
      return this.db.joinGame(this.gameKey);
    }).then(() => {
      this.loading = false;
      gameSubscription.subscribe(this.gameKey, (data) => {
        if ( data instanceof Game ) {
          if ( this.game.players.length !== data.players.length ) {
            let chunkedPlayers: any[] = [];
            let playersCopy: Player[] = data.players.slice(0);
            while ( playersCopy.length ) {
              chunkedPlayers.push(playersCopy.splice(0, 2));
            }
            this.players = {
              left: chunkedPlayers[0],
              right: chunkedPlayers[1] ?? [],
            };
          }
          this.game = data;
        }
      });
    }).catch((error: Error | any) => {
      snackBar.open('No se puedo unirse al juego.', 'Vale', {
        duration: 3500,
      }).afterDismissed().subscribe(() => {
        router.navigate(['/join']);
      });
    });
  }

  ngOnInit(): void {
  }

  startGame() {
    this.startingGame = true;
    // 8 people - 1 peace, 5 regular, 1 final
    // 7 people - 1 peace, 4 regular, 1 final
    // 6 people - 1 peace bout. 3 regular, 1 final (4 total)
    // 5 people - 2 peace bouts, 2 regular, 1 final
    // 4 people - 3 peace, 1 regular, 1 final
    // 3 people - 4 peace, 1 final
    if ( this.game.players.length >= 6 ) {
      this.game.settings.peaceBouts = this.game.settings.peaceBouts;
    } else if ( this.game.players.length < 6 ) {
      this.game.settings.peaceBouts = this.game.settings.peaceBouts <= ( 5 - ( this.game.players.length - 2 ) ) ? ( 5 - ( this.game.players.length - 2 ) ) : this.game.settings.peaceBouts;
    }
    this.game.settings.bouts = this.game.settings.peaceBouts + ( this.game.players.length - 2 );
    this.db.selectQuestions(this.game.settings.bouts).then((selectedQuestions) => {
      this.currentRoundQuestion = selectedQuestions;
      return this.db.setupGame(selectedQuestions, this.game, this.gameKey);
    });
  }

}
