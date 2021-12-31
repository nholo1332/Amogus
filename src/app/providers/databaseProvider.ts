import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from 'firebase/compat';
import {customAlphabet} from 'nanoid/async';
import {AuthService} from '../services/authServices';
import Question from '../models/question';
import Game from '../models/game';
import State from '../models/state';

@Injectable()
export class DatabaseProvider {

  private db: firebase.database.Database;

  constructor(private _db: AngularFireDatabase, private auth: AuthService) {
    this.db = _db.database;
  }

  public isGameJoinable(key: string): Promise<boolean> {
    return this.db.ref('games').child(key).once('value').then((data) => {
      return data.exists() && ( data.child('owner').val() === this.auth.currentUID() || !data.child('started').val() );
    });
  }

  public createGame(discussionTime: number, peaceBouts: number): Promise<string> {
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
    let gameKey = '';
    return nanoid().then((key) => {
      gameKey = key;
      return this.db.ref('users').child(this.auth.currentUID()).child('ownedGames').child(gameKey).set(true);
    }).then(() => {
      return this.db.ref('games').child(gameKey).set({
        owner: this.auth.currentUID(),
        settings: {
          discussionTime: discussionTime * 60,
          peaceBouts: peaceBouts,
        },
      });
    }).then(() => {
      return gameKey;
    });
  }

  public joinGame(key: string): Promise<any> {
    return this.db.ref('games').child(key).child('players').child(this.auth.currentUID()).set({
      name: this.auth.userName().firstName,
      uid: this.auth.currentUID(),
      avatar: this.auth.userAvatar(),
    }).then(() => {
      return this.db.ref('users').child(this.auth.currentUID()).child('currentGame').set(key);
    });
  }

  public selectQuestions(count: number, existingQuestions: Question[]): Promise<Question[]> {
    return this.db.ref('questions').once('value').then((data) => {
      const questions: Question[] = [];
      data.forEach((child) => {
        const newQuestion: Question = new Question().fromJSON(child.val());
        if ( existingQuestions.findIndex((question) => question.id === newQuestion.id) === -1 ) {
          questions.push(newQuestion);
        }
      });
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    });
  }

  public setupGame(questions: Question[], game: Game, key: string): Promise<void> {
    const ids: string[] = questions.map((question) => question.id);
    const leaderboard: Map<string, number> = game.players.reduce((map: any, obj) => {
      map[obj.uid] = 0;
      return map;
    }, {});
    game.state.round = 1;
    game.state.discussionTimeRemaining = game.settings.discussionTime;
    let imposter: string = game.players[Math.floor(Math.random() * game.players.length)].uid;
    return this.db.ref('games').child(key).child('players').child(imposter).child('imposter').set(true).then(() => {
      return this.db.ref('games').child(key).update({
        questions: {
          1: ids,
        },
        settings: game.settings.toJSON(),
        started: true,
        leaderboard: leaderboard,
        state: game.state.toJSON(),
      });
    });
  }

  public setupNewRound(questions: Question[], game: Game, key: string): Promise<void> {
    const ids: string[] = questions.map((question) => question.id);
    const gameRound = game.state.round;
    game.state = new State();
    let dbPlayers: any = [];
    let imposter: string = game.players[Math.floor(Math.random() * game.players.length)].uid;
    game.players.forEach((player) => {
      player.imposter = player.uid === imposter;
      player.inGame = true;
      dbPlayers[player.uid] = player.toJSON();
    });
    game.state.round = gameRound + 1;
    game.state.discussionTimeRemaining = game.settings.discussionTime;

    return this.db.ref('games').child(key).child('questions').child(String(game.state.round)).set(ids).then(() => {
      return this.db.ref('games').child(key).child('players').set(dbPlayers);
    }).then(() => {
      return this.db.ref('games').child(key).update({
        settings: game.settings.toJSON(),
        started: true,
        state: game.state.toJSON(),
      });
    });
  }

  public updateGameStarted(started: boolean, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('started').set(started);
  }

  public updateBout(bout: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('currentBout').set(bout);
  }

  public getRoundQuestions(round: number, game: Game, privelaged: boolean): Question[] {
    const questions: Question[] = [];
    ( game.questions.get(round) ?? new Map<number, string>() ).forEach((id, index) => {
      this.db.ref('questions').child(id).once('value').then((data) => {
        if ( privelaged ) {
          questions.push(new Question().fromJSON(data.val()));
        } else {
          questions.push(new Question().fromSafeJSON(data.val()));
        }
      });
    });
    return questions;
  }

  public updateDiscussion(time: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('discussionTimeRemaining').set(time);
  }

  public updateQuestionDisplay(show: boolean, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('showAnswers').set(show);
  }

  public updateRemainingDiscussionTime(time: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('discussionTimeRemaining').set(time);
  }

  public updateAnswering(canAnswer: boolean, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('canAnswer').set(canAnswer);
  }

  public updateVoting(canVote: boolean, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('canVote').set(canVote);
  }

  public removeAnswers(key: string): Promise<void> {
    return this.db.ref('games').child(key).child('answers').remove();
  }

  public answerQuestion(answer: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('answers').child(answer.toString()).transaction((value) => {
      return ( value || 0 ) + 1;
    });
  }

  public revealCorrectAnswer(correctAnswer: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('correctAnswer').set(correctAnswer);
  }

  public increaseReward(key: string): Promise<any> {
    return this.db.ref('games').child(key).child('state').child('roundReward').transaction((value) => {
      return ( value || 0 ) + 10000;
    });
  }

  public resetData(key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').update({
      showAnswers: false,
      canAnswer: false,
      correctAnswer: -1,
    }).then(() => {
      return this.db.ref('games').child(key).child('answers').remove();
    });
  }

  public enableVoting(key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('canVote').set(true);
  }

  public vote(player: string, imposterVote: boolean, key: string): Promise<void> {
    if ( imposterVote ) {
      this.db.ref('games').child(key).child('imposterVote').set(player);
    }
    return this.db.ref('games').child(key).child('votes').child(player).transaction((value) => {
      return ( value || 0 ) + 1;
    });
  }

  public removePlayer(player: string, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('players').child(player).child('inGame').set(false);
  }

  public resetAfterVote(key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').update({
      canVote: false,
    }).then(() => {
      return this.db.ref('games').child(key).child('imposterVote').remove();
    }).then(() => {
      return this.db.ref('games').child(key).child('votes').remove();
    });
  }

  public setRoundWinner(winners: string[], amount: number, key: string): Promise<void> {
    return this.db.ref('games').child(key).child('state').child('roundWinner').set(true).then(() => {
      return winners.forEach((uid) => {
        return this.db.ref('games').child(key).child('leaderboard').child(uid).transaction((value) => {
          return ( value || 0 ) + amount;
        });
      });
    }).then(() => {
      return this.db.ref('games').child(key).child('state').child('roundReward').set(0);
    });
  }

  public pushQuestion(question: Question): Promise<void> {
    return this.db.ref('questions').push(question.toJSON()).then((data) => {
      return this.db.ref('questions').child(data.key!).child('id').set(data.key);
    });
  }

  public toggleRankingsDisplay(display: boolean, gameKey: string): Promise<void> {
    return this.db.ref('games').child(gameKey).child('state').child('displayRankings').set(display);
  }

}
