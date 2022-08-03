import { Component, OnInit } from "@angular/core";
import { LoggerService } from "../services/logger.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Component({
  selector: "app-vox-pop",
  // templateUrl: "./vox-pop.component.html",
  template: `
    <div style="display: flex; flex-direction: column; align-items: center">
      <p>write your message bro</p>
      <textarea #submissionArea></textarea>
      <button (click)="submit(submissionArea.value)">submit</button>
    </div>`,
  styleUrls: ["./vox-pop.component.scss"]
})
export class VoxPopComponent implements OnInit {
  title = "Vox Pop";
  userIP: string = '';
  userAgent: string = '';
  getRequest = this.http.get(environment.baseUrl + "/vox-pop", {responseType: "text"})

  constructor(
    private log: LoggerService, 
    private http: HttpClient,
    ){
  }

  ngOnInit(): void {
    this.getUserIP().subscribe(response => {
        this.userIP = response;
    })
    this.userAgent = window.navigator.userAgent;
  }

  getUserIP(): Observable<string> {
    return this.http.get("https://api.ipify.org", {responseType: "text"});
  }

  submit(submissionText: string) {
    let dateTime = new Date();
    const body = {
      userIP: this.userIP,
      userAgent: this.userAgent,
      timestamp: dateTime,
      submission: submissionText,
    }
    console.log('msg received: ', JSON.stringify(body));
    this.http.post(environment.baseUrl + "/vox-pop", JSON.stringify(body), {responseType: "text"}).subscribe();
  }
}
