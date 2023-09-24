import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="main-app">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'snake-game';
}
