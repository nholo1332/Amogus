import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {JoinGameComponent} from './views/join-game/join-game.component';
import {MaterialModule} from '../material.module';
import {FormsModule} from '@angular/forms';
import DatabaseProvider from './providers/databaseProvider';

@NgModule({
  declarations: [
    AppComponent,
    JoinGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    MaterialModule,
    FormsModule,
  ],
  providers: [DatabaseProvider],
  bootstrap: [AppComponent],
})
export class AppModule {
}
