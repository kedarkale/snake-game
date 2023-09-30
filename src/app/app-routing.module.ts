import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { GameApproachTwoComponent } from './components/game-approach-two/game-approach-two.component';

const routes: Routes = [
  {
    title: "Snake Game",
    path: "",
    component: GameApproachTwoComponent
  },
  {
    title: "Snake Game - approach 1",
    path: "approach1",
    component: GameComponent
  },
  {
    title: "Snake Game - approach 2",
    path: "approach2",
    component: GameApproachTwoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
