import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatabaseProvider} from '../../providers/databaseProvider';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit {

  gameKey = '';
  loading = false;

  constructor(private db: DatabaseProvider, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
  }

  formatKey() {
    if ( !this.gameKey.match(/[a-z]/) ) {
      this.gameKey = this.gameKey.replace(/[^a-z]/g, '');
    }
  }

  joinGame() {
    this.loading = true;
    this.db.isGameJoinable(this.gameKey).then((joinable) => {
      if ( joinable ) {
        this.router.navigate(['game', this.gameKey]);
      } else {
        this.loading = false;
        this.snackBar.open('El juego no se puede unirse', 'Ok');
      }
    }).catch(() => {
      this.loading = false;
      this.snackBar.open('Se ha producido un error al comprobar si hay juego.', 'Ok');
    });
  }

}
