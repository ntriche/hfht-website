import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { VoxPopService, Post } from "./vox-pop.service";

@Component({
  selector: "app-vox-pop",
  templateUrl: "./vox-pop.component.html",
  styleUrls: ["./vox-pop.component.scss"]
})
export class VoxPopComponent implements OnInit {
  title = "Vox Pop";

  voxPopFormGroup = new FormGroup({
    submissionArea: new FormControl()
  });

  constructor(private voxPopService: VoxPopService) {}

  ngOnInit(): void {}

  async submit(submissionText: string): Promise<boolean> {
    if (submissionText.length < 2) {
      return false;
    }

    // lastValueFrom converts an observable into a promise
    let userIP = await lastValueFrom(this.voxPopService.getUserIP());

    let dateTime = new Date();
    const post: Post = {
      userIP: userIP,
      timestamp: dateTime,
      submission: submissionText,
    }
    
    this.voxPopService.sendSubmission(post).subscribe(res => console.log('Message from server:', res));
    this.voxPopFormGroup.controls.submissionArea.reset();
    return true;
  }
}
