import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JoinGameComponent} from './views/join-game/join-game.component';
import {MaterialModule} from '../material.module';
import {FormsModule} from '@angular/forms';
import {DatabaseProvider} from './providers/databaseProvider';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {GameComponent} from './views/game/game.component';
import {CreateComponent} from './views/create/create.component';
import {AuthService} from './services/authServices';
import {GameSubscription} from './providers/gameSubscription';
import {PlayerGameViewComponent} from './components/player-game-view/player-game-view.component';
import {PlayerRoleDisplayComponent} from './components/player-role-display/player-role-display.component';
import HelperFunctions from './providers/helperFunctions';
import {AddQuestionComponent} from './views/add-question/add-question.component';
import {NgxWigModule} from 'ngx-wig';
import { RankingsDisplayDialogComponent } from './dialog/rankings-display-dialog/rankings-display-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    JoinGameComponent,
    GameComponent,
    CreateComponent,
    PlayerGameViewComponent,
    PlayerRoleDisplayComponent,
    AddQuestionComponent,
    RankingsDisplayDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MaterialModule,
    FormsModule,
    NgxWigModule,
  ],
  providers: [DatabaseProvider, AuthService, GameSubscription, HelperFunctions],
  bootstrap: [AppComponent],
})
export class AppModule {
}
