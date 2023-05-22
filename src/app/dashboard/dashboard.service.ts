import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Submission } from './dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }
  
  postSubmissions(submissions: string): Observable<string> {
    return this.httpClient.post(environment.baseUrl + '/dashboard/submit-review', submissions, {responseType: 'text', headers: this.httpHeaders}).pipe(
      catchError(this.handleError<string>('sendReviewedSubmissions', ''))
    );
  }

  getEnqueuedPosts(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard/enqueue', {responseType: 'text', headers: this.httpHeaders}).pipe(
      catchError(this.handleError<string>('getEnqueuedPosts', ''))
    );
  }

  getUnreviewedSubmissions(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard/unreviewed', {responseType: 'text', headers: this.httpHeaders}).pipe(
      catchError(this.handleError<string>('getUnreviewedSubmissions', ''))
    );
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

  // shamelessly stolen from angular docs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
