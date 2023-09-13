import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Post {
  submission: string
}

@Injectable({providedIn: 'root'})
export class VoxPopService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) {}

  public sendSubmission(post: Post): Observable<string> {
    return this.httpClient.post(environment.baseUrl + "/vox-pop", JSON.stringify(post), {responseType: 'text', headers: this.httpHeaders})
      .pipe(
        catchError(this.errorHandler)
      )
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(error.error);
    } else {
      console.error(`Server returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('write an error message here bro'));
  }
}
