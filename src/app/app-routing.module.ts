import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JoinGameComponent} from './views/join-game/join-game.component';

const routes: Routes = [
  { path: 'join', component: JoinGameComponent },
  { path: '', redirectTo: '/join', pathMatch: 'full' },
  { path: '**', redirectTo: '/join', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
