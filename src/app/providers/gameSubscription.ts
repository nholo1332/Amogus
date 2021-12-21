import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {AuthService} from '../services/authServices';
import firebase from 'firebase/compat';
import Game from '../models/game';

@Injectable()
export class GameSubscription implements OnDestroy {

  private db: firebase.database.Database;
  private dbPath: firebase.database.Reference;

  constructor(private _db: AngularFireDatabase, private auth: AuthService) {
    this.db = _db.database;
    this.dbPath = this.db.ref('games');
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  subscribe(key: string, callback: (a: Game | undefined) => any) {
    this.dbPath = this.db.ref('games').child(key);
    this.dbPath.on('value', (value) => {
      callback(value.exists() ? new Game().fromJSON(value.val()) : undefined);
    });
  }

  unsubscribe() {
    this.dbPath.off();
  }

}
