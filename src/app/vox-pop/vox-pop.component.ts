import { Component, OnInit } from '@angular/core';
import { createClient, TumblrClient } from 'tumblr.js'
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-vox-pop',
  templateUrl: './vox-pop.component.html',
  styleUrls: ['./vox-pop.component.scss']
})
export class VoxPopComponent implements OnInit {
  title = 'Vox Pop';

  constructor(private log: LoggerService) {
    
  }

  ngOnInit(): void {
  }

}
