import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { reviewPost } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-edit-popup',
  templateUrl: './dashboard-edit-popup.component.html',
  styleUrls: ['./dashboard-edit-popup.component.scss']
})
export class DashboardEditPopupComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<string>, 
              @Inject(MAT_DIALOG_DATA) public post: reviewPost) {}

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close('word');
  }
}
