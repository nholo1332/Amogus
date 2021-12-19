import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from 'firebase/compat';
import {customAlphabet} from 'nanoid/async';
import {AuthService} from '../services/authServices';
import Question from '../models/question';
import Game from '../models/game';

@Injectable()
export class DatabaseProvider {

  private db: firebase.database.Database;

  constructor(private _db: AngularFireDatabase, private auth: AuthService) {
    this.db = _db.database;
  }

  public isGameJoinable(key: string): Promise<boolean> {
    return this.db.ref('games').child(key).once('value').then((data) => {
      return data.exists() && !data.child('started').val();
    });
  }

  public createGame(discussionTime: number, peaceBouts: number): Promise<string> {
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
    let gameKey = '';
    return nanoid().then((key) => {
      gameKey = key;
      return this.db.ref('games').child(key).set({
        owner: this.auth.currentUID(),
        settings: {
          discussionTime: discussionTime * 60,
          peaceBouts: peaceBouts,
        },
      });
    }).then(() => {
      return this.db.ref('users').child(this.auth.currentUID()).child('ownedGames').child(gameKey).set(true);
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

  public selectQuestions(count: number): Promise<Question[]> {
    return this.db.ref('questions').once('value').then((data) => {
      const questions: Question[] = [];
      data.forEach((child) => {
        questions.push(new Question().fromJSON(child.val()));
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

}
