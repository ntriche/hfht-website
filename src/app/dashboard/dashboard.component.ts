import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatDialog} from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { DashboardEditPopupComponent } from './popup/dashboard-edit-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

enum ReviewStatus {
  NotReviewed = 0,
  Denied,
  Approved,
  SuperApproved,
}

export interface Submission {
	userIP: string;
	timestampAtSubmission: Date;
	submissions: string[];
	UUID: string;
	reviewStatus: ReviewStatus;
	timestampAtPost: Date;
	postID: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  gotSubmissions: boolean = false;

  unmoderatedPosts: Submission[] = [];
  approvedPosts: Submission[] = [];
  rejectedPosts: Submission[] = [];

  constructor(public dashboardService: DashboardService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      let res = await lastValueFrom(this.dashboardService.getStoredSubmissions());
      let subs: Submission[] = JSON.parse(res) as Submission[];
      subs.forEach(sub => {
        this.unmoderatedPosts.push(sub);
      });
    } catch(err) {
      throw err;
    } finally {
      if (this.unmoderatedPosts.length > 0) {
        this.gotSubmissions = true;
      }
      this.isLoading = false;
    }
  }

  submit(): void {
    if (this.rejectedPosts.length == 0 && this.approvedPosts.length == 0) {
      this.openSnackBar('No reviewed submissions to submit!', 5000);
      return;
    }

    //const reviewedSubmissions: ReviewSubmission[] = this.approvedPosts;
    let reviewedSubmissions = JSON.stringify(this.approvedPosts) + JSON.stringify(this.rejectedPosts);

    this.dashboardService.sendReviewedSubmissions(reviewedSubmissions).subscribe(thing => console.log(thing));
    
    //let res = lastValueFrom(this.dashboardService.sendReviewedSubmissions(reviewedSubmissions));
    //console.log(res);
  }

  editPost(sub: Submission) {
    let dialogRef = this.dialog.open(DashboardEditPopupComponent, {
      data: sub
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.length > 0) {
        sub.submissions.push(result);
      }
    });
  }

  handlePost(sub: Submission, index: number, newStatus: ReviewStatus) {
    if (newStatus === sub.reviewStatus) {
      throw `Cannot change a post to new status - post already is that status! ${sub}`;
    }
    switch (sub.reviewStatus) {
      case ReviewStatus.NotReviewed:
        this.unmoderatedPosts.splice(index, 1);
        break;
      case ReviewStatus.Denied:
        this.rejectedPosts.splice(index, 1);
        break;
      case ReviewStatus.Approved:
        this.approvedPosts.splice(index, 1);
        break;
      case ReviewStatus.SuperApproved:
        this.approvedPosts.splice(index, 1);
        break;
      default:            
        throw `Post has a non-postStatus status! ${sub}`;
    }

    switch (newStatus) {
      case ReviewStatus.NotReviewed:
        throw `Post cannot be pushed back into unmoderated array! ${sub}`;
      case ReviewStatus.Denied:
        this.rejectedPosts.push(sub);
        break;
      case ReviewStatus.Approved:
        this.approvedPosts.push(sub);
        break;
      case ReviewStatus.SuperApproved:
        this.approvedPosts.unshift(sub);
        break;
      default:            
        throw `Post has an invalid newStatus! ${sub}`; 
    }

    sub.reviewStatus = newStatus;
    return;
  }

  getBorder(status: ReviewStatus): string {
    switch (status) {
      case ReviewStatus.NotReviewed:
        return '1px solid #ff6f00';
      case ReviewStatus.Denied:
        return '1px solid darkred';
      case ReviewStatus.Approved:
        return '1px solid darkgreen';
      case ReviewStatus.SuperApproved:
        return '1px solid purple';
      default:
        return '';
    }
  }

  openSnackBar(message: string, duration: number): void {
    this.snackBar.open(message, 'Okay', {
      duration: duration
    });
  }
}
