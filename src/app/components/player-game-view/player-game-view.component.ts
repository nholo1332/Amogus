import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import Game from '../../models/game';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../services/authServices';
import {DatabaseProvider} from '../../providers/databaseProvider';
import Question from '../../models/question';
import HelperFunctions from '../../providers/helperFunctions';
import Player from '../../models/player';

@Component({
  selector: 'app-player-game-view',
  templateUrl: './player-game-view.component.html',
  styleUrls: ['./player-game-view.component.scss'],

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
export class PlayerGameViewComponent implements OnInit {

  @Input() game: Game = new Game();
  @Input() gameKey: string = '';

  name = '';
  isOwner = false;
  isImposter = false;

  currentRoundQuestions: Question[] = [];

  lastRound = -1;
  lastBout = 0;

  discussionTime = 180;
  allAnswered = false;

  answeredQuestion = false;

  constructor(private auth: AuthService, private db: DatabaseProvider, private helperFunctions: HelperFunctions) {
  }

  ngOnInit(): void {
  }

  getMyPoints(): number {
    return this.game.leaderboard.get(this.auth.currentUID()) ?? 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( this.lastRound === -1 ) {
      this.name = this.auth.userName().firstName;
      this.isOwner = this.game.owner === this.auth.currentUID();
      this.isImposter = ( this.game.players.find((player) => player.imposter) ?? new Player() ).uid === this.auth.currentUID();
      this.lastRound = 0;
    }
    if ( this.game.state.currentBout === 0 && this.isOwner ) {
      setTimeout(() => {
        this.db.updateBout(1, this.gameKey);
      }, 1200);
    }
    if ( this.lastRound < this.game.state.round ) {
      this.answeredQuestion = false;
      this.currentRoundQuestions = this.db.getRoundQuestions(1, this.game, this.isOwner || this.isImposter);
    }
    this.lastRound = this.game.state.round;
    if ( this.lastBout < this.game.state.currentBout && this.isOwner ) {
      this.boutCycle();
    }
    this.lastBout = this.game.state.currentBout;
    if ( this.isOwner && this.game.state.canAnswer ) {
      const usersInGame = this.game.players.filter((player) => player.inGame);
      this.allAnswered = usersInGame.length === this.game.answers.size;
    }
    /*if ( ( changes as any ).game.currentValue !== undefined ) {
      this.game = ( changes as any ).game.currentValue as Game;
      console.log(this.game.state.discussionTimeRemaining);
    }*/
  }

  awaitAllAnswered(conditionFunction: () => boolean): Promise<any> {
    const poll = (resolve: any) => {
      if ( conditionFunction() ) {
        resolve();
      } else {
        setTimeout(() => poll(resolve), 700);
      }
    };
    return new Promise(poll);
  }

  skipDiscussion() {
    this.discussionTime = 1;
  }

  answerQuestion(answer: number) {
    this.db.answerQuestion(answer, this.gameKey).then(() => {
      this.answeredQuestion = true;
    });
  }

  getTime(): string {
    const minutes = Math.floor(this.game.state.discussionTimeRemaining / 60);
    const seconds = this.game.state.discussionTimeRemaining - ( minutes * 60 );
    return this.helperFunctions.stringPadding(minutes, '0', 2) + ':' + this.helperFunctions.stringPadding(seconds, '0', 2);
  }

  discussionTimer(): Promise<boolean> {
    this.discussionTime = this.game.settings.discussionTime;
    return new Promise<boolean>((resolve, reject) => {
      const timer = setInterval(() => {
        this.discussionTime--;
        this.db.updateDiscussion(this.discussionTime, this.gameKey);
        if ( this.discussionTime <= 0 ) {
          clearInterval(timer);
          return resolve(true);
        }
      }, 1000);
    });
  }

  boutCycle() {
    this.db.removeAnswers(this.gameKey).then(() => {
      return this.db.updateDiscussion(this.discussionTime, this.gameKey);
    }).then(() => {
      return this.helperFunctions.awaitTime(5000);
    }).then(() => {
      return this.db.updateQuestionDisplay(true, this.gameKey);
    }).then(() => {
      return this.discussionTimer();
    }).then(() => {
      return this.db.updateAnswering(true, this.gameKey);
    }).then(() => {
      return this.awaitAllAnswered(() => this.allAnswered);
    }).then(() => {
      console.log('all answered');
    });
  }

}
