import { AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from '../dashboard.service';
import { Submission } from '../dashboard.component';

@Component({
  selector: 'app-dashboard-edit-popup',
  templateUrl: './dashboard-edit-popup.component.html',
  styleUrls: ['./dashboard-edit-popup.component.scss', '../dashboard.component.scss']

})
export class DashboardEditPopupComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<Submission>, @Inject(MAT_DIALOG_DATA) public sub: Submission, public dashboardService: DashboardService) {}

  @ViewChild('originalText') originalTextDiv!: ElementRef

  ngAfterViewInit(): void {
    this.originalTextDiv.nativeElement
  }

  close() {
    this.dialogRef.close("");
  }

  confirm(newText: string) {
    if (newText == this.sub.submissions[this.sub.submissions.length - 1]) {
      // if the confirm button was pressed but nothing was changed, return nothing
      // TODO: add a form control to the textarea or something so I can simply check if the form is dirty rather than doing a strict comparison
      this.dialogRef.close("");
    }
    this.dialogRef.close(newText);
  }

  getMostRecentEdit(sub: Submission): string {
    if (sub.submissions[sub.submissions.length - 1] == sub.submissions[0]) {
      return ''
    }
    return sub.submissions[sub.submissions.length - 1];
  }
}
