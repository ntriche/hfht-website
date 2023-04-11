import { Component, OnInit } from '@angular/core';
import { voxPop } from '../vox-pop/interface/vox-pop.interface';
import { DashboardService } from './dashboard.service';
import { MatDialog} from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { DashboardEditPopupComponent } from './popup/dashboard-edit-popup.component';

enum postStatus {
  NotReviewed = 0,
  Denied,
  Approved,
  SuperApproved,
}
export interface reviewPost {
  status: postStatus,
  pop: voxPop,
  edit: string,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  gotSubmissions: boolean = false;

  unmoderatedPosts: reviewPost[] = [];
  approvedPosts: reviewPost[] = [];
  rejectedPosts: reviewPost[] = [];

  constructor(public dashboardService: DashboardService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      let res = await lastValueFrom(this.dashboardService.getPosts());
      let pops: voxPop[] = JSON.parse(res) as voxPop[];
      for (let i = 0; i < pops.length; i++) {
        const post: reviewPost = {
          status: postStatus.NotReviewed,
          pop: pops[i],
          edit: "",
        }
        this.unmoderatedPosts.push(post);
      }
    } catch(err) {
      throw err;
    } finally {
      if (this.unmoderatedPosts.length > 0) {
        this.gotSubmissions = true;
      }
      this.isLoading = false;
    }
  }

  editPost(post: reviewPost) {
    let dialogRef = this.dialog.open(DashboardEditPopupComponent, {
      data: post
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.length > 0) {
        post.edit = result;
      }
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
