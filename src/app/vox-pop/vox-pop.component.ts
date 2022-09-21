import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { VoxPopService, Post } from "./vox-pop.service";

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

  constructor(private voxPopService: VoxPopService) {
  }

  ngOnInit(): void {}

  async submit(submissionText: string) {
    let userIP = await lastValueFrom(this.voxPopService.getUserIP());

    let dateTime = new Date();
    const post: Post = {
      userIP: userIP,
      timestamp: dateTime,
      submission: submissionText,
    }

    console.log('Submitting post with this content:', post);
    this.voxPopService.sendSubmission(post).subscribe(res => console.log('Message from server:', res));
  }
}
