import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/authServices';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatabaseProvider} from '../../providers/databaseProvider';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  loading = true;
  signedIn = false;
  creatingGame = false;

  discussionTime = 3;
  peaceBouts = 1;

  constructor(private auth: AuthService, private snackBar: MatSnackBar, private db: DatabaseProvider,
              private router: Router) {
    auth.getAuthState().then((user) => {
      if ( user !== null ) {
        return user;
      } else {
        snackBar.open('Iniciar sesión con Google', '', {
          duration: 2000,
        });
        return auth.googleSingIn();
      }
    }).then((user) => {
      if ( user !== null ) {
        this.signedIn = true;
        this.loading = false;
      }
    }).catch(() => {
      snackBar.open('Error al iniciar sesión', 'Vale');
    });
  }

  ngOnInit(): void {
  }

  createGame() {
    this.creatingGame = true;
    this.db.createGame(this.discussionTime, this.peaceBouts).then((key) => {
      this.router.navigate(['/game', key]);
    }).catch(() => {
      this.creatingGame = false;
      this.snackBar.open('Error al crear un juego', 'Vale');
    });
  }

}
