import { AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { reviewPost } from '../dashboard.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-edit-popup',
  templateUrl: './dashboard-edit-popup.component.html',
  styleUrls: ['../dashboard.component.scss']

})
export class DashboardEditPopupComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<reviewPost>, @Inject(MAT_DIALOG_DATA) public post: reviewPost, public dashboardService: DashboardService) {}

  @ViewChild('originalText') originalTextDiv!: ElementRef

  ngAfterViewInit(): void {
    this.originalTextDiv.nativeElement
  }

  close() {
    this.dialogRef.close("");
  }

  confirm(newText: string) {
    if (newText == this.post.pop.submissions[this.post.pop.submissions.length - 1]) {
      // if the confirm button was pressed but nothing was changed, return nothing
      // TODO: add a form control to the textarea or something so I can simply check if the form is dirty rather than doing a strict comparison
      this.dialogRef.close("");
    }
    this.dialogRef.close(newText);
  }
}
