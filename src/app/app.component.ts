import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template:`
  <div>
    <div class="header">
      <a routerLink="/home" routerLinkActive="active" ariaCurrentWhenActive="page" class="link">Home</a>
      <a routerLink="/vox-pop" routerLinkActive="active" ariaCurrentWhenActive="page" class="link">Vox Pop</a>
      <a routerLink="/dashboard" routerLinkActive="active" ariaCurrentWhenActive="page" class="link">Dashboard</a>
    </div>
    <router-outlet></router-outlet>
  </div>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hfht-website';
}
