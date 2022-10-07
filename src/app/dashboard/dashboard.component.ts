import { Component, OnInit } from '@angular/core';
import { voxPop } from '../vox-pop/interface/vox-pop.interface';
import { DashboardService } from './dashboard.service';

enum postStatus {
  NotReviewed = 0,
  Denied,
  Approved,
  SuperApproved,
}
interface reviewPost {
  status: postStatus,
  pop: voxPop
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: reviewPost[] = []  

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getPosts().subscribe({
      next: v => {
        let pops: voxPop[] = JSON.parse(v) as voxPop[];
        for (let i = 0; i < pops.length; i++) {
          const post: reviewPost = {
            status: postStatus.NotReviewed,
            pop: pops[i]
          }
          this.posts.push(post);
        }
        console.log(this.posts);
      },
      error: (e) => {throw e},
    });
  }
}
