import { Injectable } from '@angular/core';
import { CommentResponse } from 'app/models/response';
import { RestService } from './rest.service';
import { Comment, ModifyComment } from 'app/models/comment';

@Injectable()
export class CommentsService {

  constructor(private restService: RestService) { }

  public getComments(page: number, size: number, userName: string) {
    var url = `/admin/comments/get?username=${userName}&page=${page}&size=${size}`;
    return this.restService.get<CommentResponse>(url);
  }

  public editComment(commentId: string, comment: ModifyComment) {
    var url = `/admin/comment/edit&comment_id=${commentId}`;
    return this.restService.put<any>(url, comment);
  }

  public deleteComment(userName: string, commentId: string) {
    var url = `/admin/comment/delete?username=${userName}&comment_id=${commentId}`;
    return this.restService.delete<string>(url);
  }
}
