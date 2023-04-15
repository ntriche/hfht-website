import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Submission } from './dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }
  
  sendReviewedSubmissions(submissions: string): Observable<Object> {
    return this.httpClient.post(environment.baseUrl + '/dashboard', submissions, {headers: this.httpHeaders})
  }

  getEnqueuedPosts(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard/enqueue', {responseType: 'text', headers: this.httpHeaders})
  }

  getStoredSubmissions(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard/unreviewed', {responseType: 'text', headers: this.httpHeaders})
  }

  getMostRecentSubmission(sub: Submission): string {
    return sub.submissions[sub.submissions.length - 1];
  }

  getPostIP(sub: Submission): string {
    if (!!sub.userIP) {
      return sub.userIP;
    }
    return `No IP`;
  }
}
