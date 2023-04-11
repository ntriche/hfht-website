import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { reviewPost } from './dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }

  getPosts(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard', {responseType: 'text', headers: this.httpHeaders})
  }
  
  // determines which post should be displayed on the dashboard and returns it
  getPostSubmission(post: reviewPost): string {
    // edit is filled out on the dashboard manually only
    if (post.edit.length > 0) {
      return post.edit;
    }
    return post.pop.submissions[post.pop.submissions.length - 1];
  }

  getPostIP(post: reviewPost): string {
    if (!!post.pop.userIP) {
      return post.pop.userIP;
    }
    return `No IP`;
  }
}
