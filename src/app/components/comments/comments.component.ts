import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment, ModifyComment } from 'app/models/comment';
import { CommentsService } from 'app/services/comments.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  public user: string;
  public comments: Comment[];
  public page = 1;
  public size = 10;


  public showEditors = [];

  constructor(private route: ActivatedRoute, private router: Router, private commentService: CommentsService) {
    this.route.params
      .pipe(
        switchMap(params => {
          this.user = params['userName'];
          return this.commentService.getComments(this.page, this.size, this.user);
        }))
      .subscribe(res => {
        this.comments = res.comments;
        res.comments.forEach(_ => this.showEditors.push(false));
      });
  }

  public edit(index: number) {
    this.showEditors[index] = false;
    var comm = this.comments[index];
    var modifyComm = { content: comm.content, rating: comm.rating, username: comm.username } as ModifyComment;
    this.commentService.editComment(comm.comment_id, modifyComm).subscribe();
  }

  public delete(commentId: string, index: number) {
    this.comments.splice(index, 1);
    this.commentService.deleteComment(this.user, commentId).subscribe();
  }

  public switchEditor(index: number, val: boolean) {
    this.showEditors[index] = val;
  }
}
