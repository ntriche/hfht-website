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

  private tumblr: TumblrClient | undefined;

  constructor(private log: LoggerService) {
    
  }

  ngOnInit(): void {
  }

  authenticate(): void{
    let t: TumblrClient | null = null;
    try {
      t = createClient({
        consumer_key: '18ylKdp8vfz6DQQjuXP2rQf8w7ThPNSvp5wBZkuyQnbl2og1Db',
        consumer_secret: 'XuSKR37fCSeHLcC5vfZ2ZCveBcFHDeOPDFr4AYKBiJNHvuGHPz',
        token: '41RRIc45CKUwYZzvnBEaq5rp7YKpX5Bz6vJ7efp4QRxgnWk4zT',
        token_secret: '1kU4AGoF4HLqUxccBI7q3XZwiJoTo8ZZwBr6I7AhNNTrr2XKt7'
      });
    } catch (e) {
      this.log.error('Failed to create tumblr client - ' + (e as Error).message);
      return;
    }
    if (t === null || t === undefined) {
      this.log.error('Failed to create tumblr client - client is null or undefined');
      return;
    }
    this.log.write('Tumblr client successfully authenticated');
    this.tumblr = t;
  }

  // createPost(content: string): void {
  //   tumblr.blogPosts('hfht-vox-populi.tumblr.com', { type: 'text' }, function (err, data) {
  //       // ...
  //   });
  // }

}
