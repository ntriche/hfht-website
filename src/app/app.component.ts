import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template:`
  <div style="display: flex; align-items: center; flex-direction: column; margin-top: 20vh">
    <h1>wassup mellos</h1>
    <div>
      <ul>
        <li><a routerLink="/home" routerLinkActive="active" ariaCurrentWhenActive="page">goto home</a></li>
        <li><a routerLink="/vox-pop" routerLinkActive="active" ariaCurrentWhenActive="page">goto vox pop</a>
      </ul>
    </div>
    <router-outlet></router-outlet>
  </div>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hfht-website';
}
