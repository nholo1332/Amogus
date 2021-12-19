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

  joinGame() {
    this.loading = true;
    this.db.isGameJoinable(this.gameKey).then((joinable) => {
      if ( joinable ) {
        this.router.navigate(['game', this.gameKey]);
      } else {
        this.loading = false;
        this.snackBar.open('Game is not joinable.', 'Ok');
      }
    }).catch(() => {
      this.loading = false;
      this.snackBar.open('Error occurred when checking for game.', 'Ok');
    });
  }

}
