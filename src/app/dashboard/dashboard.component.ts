import { Component, OnInit } from '@angular/core';
import { voxPop } from '../vox-pop/interface/vox-pop.interface';
import { DashboardService } from './dashboard.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardEditPopupComponent } from '../dashboard-edit-popup/dashboard-edit-popup.component';

enum postStatus {
  NotReviewed = 0,
  Denied,
  Approved,
  SuperApproved,
}
export interface reviewPost {
  status: postStatus,
  pop: voxPop
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  unmoderatedPosts: reviewPost[] = [];
  approvedPosts: reviewPost[] = [];
  rejectedPosts: reviewPost[] = [];

  constructor(private dashboardService: DashboardService, 
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dashboardService.getPosts().subscribe({
      next: v => {
        let pops: voxPop[] = JSON.parse(v) as voxPop[];
        for (let i = 0; i < pops.length; i++) {
          const post: reviewPost = {
            status: postStatus.NotReviewed,
            pop: pops[i]
          }
          this.unmoderatedPosts.push(post);
        }
      },
      error: (e) => {throw e},
    });
  }

  editPost(post: reviewPost) {
    let dialogRef = this.dialog.open(DashboardEditPopupComponent, {
      data: post,
      height: '400px',
      width: '600px',
    }); 
  }

  handlePost(post: reviewPost, index: number, newStatus: postStatus) {
    if (newStatus === post.status) {
      throw `Cannot change a post to new status - post already is that status! ${post}`;
    }
    switch (post.status) {
      case postStatus.NotReviewed:
        this.unmoderatedPosts.splice(index, 1);
        break;
      case postStatus.Denied:
        this.rejectedPosts.splice(index, 1);
        break;
      case postStatus.Approved:
        this.approvedPosts.splice(index, 1);
        break;
      case postStatus.SuperApproved:
        this.approvedPosts.splice(index, 1);
        break;
      default:            
        throw `Post has a non-postStatus status! ${post}`;
    }

    switch (newStatus) {
      case postStatus.NotReviewed:
        throw `Post cannot be pushed back into unmoderated array! ${post}`;
      case postStatus.Denied:
        this.rejectedPosts.push(post);
        break;
      case postStatus.Approved:
        this.approvedPosts.push(post);
        break;
      case postStatus.SuperApproved:
        this.approvedPosts.unshift(post);
        break;
      default:            
        throw `Post has an invalid newStatus! ${post}`; 
    }

    post.status = newStatus;
    return;
  }
}
