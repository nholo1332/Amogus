import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {first} from 'rxjs';
import auth = firebase.auth;
import User = firebase.User;

@Injectable()
export class AuthService {

  authState: User | null = null;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  currentUID(): string {
    return ( this.authState !== null ) ? this.authState.uid : '';
  }

  userName(): { firstName: string, lastName: string } {
    if ( this.authState !== null ) {
      const names = ( this.authState.displayName ?? '' ).split(' ');
      return names.length >= 2 ? { firstName: names[0], lastName: names[1] } : { firstName: names[0], lastName: '' };
    } else {
      return { firstName: '', lastName: '' };
    }
  }

  userAvatar(): string {
    return this.authState !== null ? ( this.authState.photoURL ?? '' ) : '';
  }

  getAuthState() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  googleSingIn(): Promise<User> {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider).then((data) => {
      this.authState = data.user;
      return data.user!;
    });
  }

  signOut() {
    return firebase.auth().signOut();
  }

}
