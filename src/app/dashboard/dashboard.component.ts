import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatDialog} from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { DashboardEditPopupComponent } from './popup/dashboard-edit-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Submission {
  userIP: string;
  timestampAtSubmission: Date;
  submissions: string[];
  UUID: string;
  reviewStatus: ReviewStatus;
  timestampAtPost: Date;
  postID: string;
  quality: Quality;
}

enum ReviewStatus {
  NotReviewed = 0,
  Denied,
  Approved,
  SuperApproved,
}

export enum Quality {
	None = 0,
	Poor,
	Common,
	Uncommon,
	Rare,
	Epic,
	Legendary,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  isSubmissionDisabled: boolean = false;
  gotSubmissions: boolean = false;

  unmoderatedPosts: Submission[] = [];
  approvedPosts: Submission[] = [];
  rejectedPosts: Submission[] = [];

  constructor(public dashboardService: DashboardService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    await this.retrieveUnreviewedSubmissions();
  }

  async retrieveUnreviewedSubmissions(): Promise<void> {
    this.isLoading = true;
    try {
      const response: string = await lastValueFrom(this.dashboardService.getUnreviewedSubmissions());
      let subs: Submission[] = JSON.parse(response) as Submission[];
      subs.forEach(sub => {
        this.unmoderatedPosts.push(sub);
      });
    } catch(err) {
      console.log('Failed to fetch unreviewed submissions from server - ', err);
    } finally {
      if (this.unmoderatedPosts.length > 0) {
        this.gotSubmissions = true;
        this.isSubmissionDisabled = false;
      } else {
        this.gotSubmissions = false;
        this.isSubmissionDisabled = true;
      }
      this.isLoading = false;
    }
  }
 
  async onClickSubmit(): Promise<void> {    
    this.isSubmissionDisabled = true;
    if (this.rejectedPosts.length == 0 && this.approvedPosts.length == 0) {
      this.openSnackBar('No reviewed submissions to submit!');
      this.isSubmissionDisabled = false;
      return;
    }

    this.isLoading = true;
    const reviewedSubmissions = JSON.stringify(this.rejectedPosts.concat(this.approvedPosts));
    try {
      const response: string = await lastValueFrom(this.dashboardService.postSubmissions(reviewedSubmissions));
      // If the server returns an error code (i.e. a 400 or 500 type), an error is automatically thrown and no manual error checking is required
      this.openSnackBar('Success: ' + response);
      // Clear rejected and approved posts and then fetch new unreviewed posts
      this.rejectedPosts = [];
      this.approvedPosts = [];
      await this.retrieveUnreviewedSubmissions();
    } catch(err) {
      console.log('Failed to submit reviewed submissions to server - ', err);
    } finally {
      this.isSubmissionDisabled = false;
      this.isLoading = false;
    }
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
      this.openSnackBar(`Cannot change a post to new status - post already is that status! ${sub}`);
      return;
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
        this.openSnackBar(`Post has an invalid post status! ${sub}`);
        return;
    }

    switch (newStatus) {
      case ReviewStatus.NotReviewed:
        this.openSnackBar(`Post cannot be pushed back into unmoderated array! ${sub}`);
        return;
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
        this.openSnackBar(`Post has an invalid newStatus! ${sub}`);
        return;
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

  openSnackBar(message: string, response: string = 'Okay', duration: number = 5000): void {
    this.snackBar.open(message, response, {
      duration: duration
    });
  }
}
