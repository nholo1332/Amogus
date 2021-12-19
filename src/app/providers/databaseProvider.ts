import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from 'firebase/compat';

@Injectable()
export class DatabaseProvider {

  private db: firebase.database.Database;

  constructor(private _db: AngularFireDatabase) {
    this.db = _db.database;
  }

  public isGameJoinable(key: string): Promise<boolean> {
    return this.db.ref('games').child(key).once('value').then((data) => {
      return data.exists() && !data.child('started').val();
    });
  }

}
