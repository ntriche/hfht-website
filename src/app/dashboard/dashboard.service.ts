import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }

  getPosts(): Observable<string> {
    return this.httpClient.get(environment.baseUrl + '/dashboard', {responseType: 'text', headers: this.httpHeaders})
  }
}
