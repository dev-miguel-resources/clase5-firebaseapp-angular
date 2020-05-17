import { Component, OnInit, Input } from '@angular/core';
import { PostService } from './post.service';
import { PostI } from '../../shared/models/post.interface';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: PostI;

  constructor(private postSvc: PostService) { }

  ngOnInit() {
    
  }

}
