import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { VoxPopService, Post } from "./vox-pop.service";
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private voxPopService: VoxPopService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Okay', {
      duration: 300000
    });
  }

  async fetchUserIP(): Promise<string> {
    let userIP = ''
    try {
      // lastValueFrom converts an observable into a promise
      userIP = await lastValueFrom(this.voxPopService.getUserIP());
    } catch {
      console.error("Failed to fetch user IP");
    }
    return userIP;
  }
  
  prevalidate(submissionText: string): boolean {
    if (submissionText.length < 1) {
      this.openSnackBar("Your submission is too short!");
      return false;
    }
    if (submissionText.length > 4096) {
      this.openSnackBar("Your submission is too long!");
      return false;
    }
    return true;
  }

  async submit(submissionText: string): Promise<void> {
    if (!this.prevalidate(submissionText)) {
      return;
    }

    const post: Post = {
      userIP: await this.fetchUserIP(),
      submission: submissionText,
    }

    let res = await lastValueFrom(this.voxPopService.sendSubmission(post));
    console.log(res);

    this.voxPopFormGroup.controls.submissionArea.reset();
    return;
  }
}
