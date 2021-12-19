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
import { GameComponent } from './views/game/game.component';
import { CreateComponent } from './views/create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    JoinGameComponent,
    GameComponent,
    CreateComponent,
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
  ],
  providers: [DatabaseProvider],
  bootstrap: [AppComponent],
})
export class AppModule {
}
