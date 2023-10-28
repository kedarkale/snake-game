import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { GameApproachTwoComponent } from './components/game-approach-two/game-approach-two.component';
import { BoxScreensaverComponent } from './components/box-screensaver/box-screensaver.component';
import { CanvasOneComponent } from './components/canvas-one/canvas-one.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameApproachTwoComponent,
    BoxScreensaverComponent,
    CanvasOneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
