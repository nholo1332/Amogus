import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import Game from '../../models/game';
import {animate, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../services/authServices';
import {DatabaseProvider} from '../../providers/databaseProvider';
import Question from '../../models/question';
import HelperFunctions from '../../providers/helperFunctions';
import Player from '../../models/player';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActionNotifications} from '../../models/actionNotifications';
import {MatDialog, MatDialogRef, MatDialogState} from '@angular/material/dialog';
import {RankingsDisplayDialogComponent} from '../../dialog/rankings-display-dialog/rankings-display-dialog.component';

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
  selectedAnswer = -1;

  allVoted = false;

  playersInGame: Player[] = [];

  voted = false;
  selectedVote = '';

  @Output() actionNotifier = new EventEmitter();

  rankingsDialog: MatDialogRef<RankingsDisplayDialogComponent> | undefined = undefined;

  lastNumberOfInGamePlayers = 0;
  votedOutPlayers: string[] = [];

  constructor(private auth: AuthService, private db: DatabaseProvider, private helperFunctions: HelperFunctions,
              private snackBar: MatSnackBar, private matDialog: MatDialog) {
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
      this.lastNumberOfInGamePlayers = this.game.players.filter((player) => player.inGame).length;
      this.votedOutPlayers = [];
    }
    if ( this.game.state.currentBout === 0 && this.isOwner ) {
      setTimeout(() => {
        this.db.updateBout(1, this.gameKey);
      }, 1200);
    }
    if ( this.lastRound < this.game.state.round ) {
      this.currentRoundQuestions = this.db.getRoundQuestions(this.game.state.round, this.game, this.isOwner || this.isImposter);
      this.isImposter = ( this.game.players.find((player) => player.imposter) ?? new Player() ).uid === this.auth.currentUID();
      this.lastRound = 0;
    }
    this.lastRound = this.game.state.round;
    if ( this.lastBout < this.game.state.currentBout && this.isOwner ) {
      this.boutCycle();
    }
    if ( this.lastBout < this.game.state.currentBout ) {
      this.answeredQuestion = false;
      this.selectedAnswer = -1;
      this.voted = false;
      this.selectedVote = '';
    }
    this.lastBout = this.game.state.currentBout;
    this.playersInGame = this.game.players.filter((player) => player.inGame);
    if ( this.isOwner && this.game.state.canAnswer ) {
      let answers = 0;
      for ( const [key, value] of this.game.answers.entries() ) {
        answers += value;
      }
      this.allAnswered = this.playersInGame.length === answers;
    }
    if ( this.isOwner && this.game.state.canVote ) {
      let votes = 0;
      for ( const [key, value] of this.game.votes.entries() ) {
        votes += value;
      }
      this.allVoted = this.playersInGame.length === votes;
    }
    if ( this.game.state.displayRankings && !this.isOwner ) {
      this.openRankingsDisplay();
    } else if ( !this.game.state.displayRankings && this.rankingsDialog !== undefined && !this.isOwner ) {
      this.rankingsDialog.close();
    }
    /*if ( ( changes as any ).game.currentValue !== undefined ) {
      this.game = ( changes as any ).game.currentValue as Game;
      console.log(this.game.state.discussionTimeRemaining);
    }*/
    if ( this.lastNumberOfInGamePlayers > this.game.players.filter((player) => player.inGame).length && !this.isOwner ) {
      const playersInGameLastRound = this.game.players.filter((player) => this.votedOutPlayers.includes(player.uid));
      const votedOutPlayer = ( playersInGameLastRound.find((player) => !player.inGame) ?? new Player() );
      this.votedOutPlayers.push(votedOutPlayer.uid);
      this.snackBar.open('¡' + votedOutPlayer.name + ' ha sido votado fuera!', '', {
        duration: 2500,
      });
    }
    this.lastNumberOfInGamePlayers = this.game.players.filter((player) => player.inGame).length;
  }

  inGame(): boolean {
    const uid = this.auth.currentUID();
    return ( this.game.players.find((player) => player.uid === uid) ?? new Player() ).inGame;
  }

  getTimerTitle(): string {
    if ( this.game.state.discussionTimeRemaining === 0 && !this.game.state.canVote ) {
      return 'Contestar';
    } else if ( this.game.state.discussionTimeRemaining !== 0 && !this.game.state.canVote ) {
      return 'Discutir';
    } else if ( this.game.state.canVote ) {
      return 'Votar';
    } else {
      return '';
    }
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

  getAnswerClass(answer: number): string {
    if ( this.game.state.correctAnswer !== -1 ) {
      const popularAnswer = [...this.game.answers.entries()].reduce((a, e) => e[1] > a[1] ? e : a)[0];
      if ( this.game.state.correctAnswer === popularAnswer && popularAnswer === answer ) {
        return 'correct-answer';
      } else if ( this.game.state.correctAnswer !== popularAnswer && popularAnswer === answer ) {
        return 'wrong-answer';
      } else {
        return '';
      }
    } else if ( this.game.state.correctAnswer === -1 && this.answeredQuestion ) {
      return answer === this.selectedAnswer ? 'my-answer' : '';
    } else {
      return '';
    }
  }

  skipDiscussion() {
    this.discussionTime = 1;
  }

  answerQuestion(answer: number) {
    this.answeredQuestion = true;
    this.selectedAnswer = answer;
    this.db.answerQuestion(answer, this.gameKey).catch(() => {
      this.answeredQuestion = false;
      this.selectedAnswer = -1;
    });
  }

  voteUser(uid: string) {
    this.selectedVote = uid;
    this.voted = true;
    this.db.vote(uid, this.isImposter && this.game.state.currentBout < this.game.settings.bouts, this.gameKey).catch(() => {
      this.selectedVote = '';
      this.voted = false;
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
      return this.db.revealCorrectAnswer(this.currentRoundQuestions[this.game.state.currentBout - 1].answer, this.gameKey);
    }).then(() => {
      const popularAnswer = [...this.game.answers.entries()].reduce((a, e) => e[1] > a[1] ? e : a)[0];
      if ( popularAnswer === this.game.state.correctAnswer ) {
        return this.db.increaseReward(this.gameKey);
      } else {
        return true;
      }
    }).then(() => {
      return this.db.resetData(this.gameKey);
    }).then(() => {
      if ( this.game.state.currentBout <= this.game.settings.peaceBouts ) {
        return true;
      } else {
        return this.handleVote();
      }
    }).then(() => {
      if ( this.game.state.currentBout === this.game.settings.bouts ) {
        const winners: string[] = [];
        if ( this.playersInGame.findIndex((player) => player.imposter) !== -1 ) {
          // Imposter still in game
          winners.push(this.playersInGame.find((player) => player.imposter)!.uid);
        } else {
          // Imposter not in game
          this.playersInGame.forEach((player) => {
            winners.push(player.uid);
          });
        }
        return this.db.setRoundWinner(winners, this.game.state.roundReward, this.gameKey);
      } else {
        return this.db.updateBout(this.game.state.currentBout + 1, this.gameKey);
      }
    });
  }

  getWinners(): Player[] {
    const winners: Player[] = [];
    if ( this.playersInGame.findIndex((player) => player.imposter) !== -1 ) {
      winners.push(this.playersInGame.find((player) => player.imposter)!);
    } else {
      this.playersInGame.forEach((player) => {
        winners.push(player);
      });
    }
    return winners;
  }

  handleVote(): Promise<any> {
    let votedPlayerUID = '';
    return this.db.enableVoting(this.gameKey).then(() => {
      return this.awaitAllAnswered(() => this.allVoted);
    }).then(() => {
      if ( this.game.state.currentBout === this.game.settings.bouts ) {
        return [...this.game.votes.entries()].reduce((a, e) => e[1] > a[1] ? e : a)[0];
      } else {
        return this.game.imposterVote;
      }
    }).then((uid) => {
      votedPlayerUID = uid;
      return this.db.removePlayer(uid, this.gameKey);
    }).then(() => {
      const playerName = ( this.game.players.find((player) => player.uid === votedPlayerUID) ?? new Player() ).name;
      this.snackBar.open('¡' + playerName + ' ha sido votado fuera!', '', {
        duration: 2500,
      });
      return this.helperFunctions.awaitTime(2800);
    }).then(() => {
      return this.db.resetAfterVote(this.gameKey);
    });
  }

  startNewRound() {
    this.lastRound = this.game.state.round;
    this.lastBout = 0;
    this.discussionTime = 1;
    this.allAnswered = false;
    this.answeredQuestion = false;
    this.selectedAnswer = -1;
    this.allVoted = false;
    this.playersInGame = [];
    this.voted = false;
    this.selectedVote = '';
    this.actionNotifier.emit(ActionNotifications.startNewRound);
  }

  displayFinalRankings() {
    // Show dialog to allow closing out (only for owner) if players decide to play another round
    // Also emit event to database to display dialog without close option on player devices
    this.db.toggleRankingsDisplay(true, this.gameKey).then(() => {
      this.openRankingsDisplay();
    });
  }

  openRankingsDisplay() {
    if ( this.rankingsDialog === undefined || this.rankingsDialog.getState() === MatDialogState.CLOSED ) {
      this.rankingsDialog = this.matDialog.open(RankingsDisplayDialogComponent, {
        width: '90%',
        maxWidth: 450,
        disableClose: true,
        data: {
          game: this.game,
          isOwner: this.isOwner,
        },
      });

      if ( this.isOwner ) {
        this.rankingsDialog.afterClosed().subscribe(() => {
          this.db.toggleRankingsDisplay(false, this.gameKey);
        });
      }
    }
  }

}
