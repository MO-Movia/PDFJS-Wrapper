import { Injectable } from '@angular/core';
import { CommentSelection } from './models/comment-selection.model';
import { Subject } from 'rxjs';

export interface Comment extends CommentSelection {
  text: string;
  comment: string;
}
export interface Highlight {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public tagListPrivate: string[] = [];
  public tagListPublic: string[] = [];
  public commentList: Comment[] = [];
  public highlightList: any[] = [];

  private submitActionSourceComment = new Subject<void>();
  submitActionComment$ = this.submitActionSourceComment.asObservable();

  private submitActionSourceTag = new Subject<void>();
  submitActionTag$ = this.submitActionSourceTag.asObservable();

  submitComment() {
    this.submitActionSourceComment.next();
  }

  submitTag(){
    this.submitActionSourceTag.next();
  }
  
  public updateTagListPrivate(tagPrivate: string):void {
    this.tagListPrivate.push(tagPrivate);
  }

  public getTagListPrivate(): string[] {
    return this.tagListPrivate;
  }

  public updateTagListPublic(tagPublic: string):void {
    this.tagListPublic.push(tagPublic);
  }

  public getTagListPublic(): string[] {
    return this.tagListPublic;
  }

  public updateHighlightList(hightlight: any) {
    this.highlightList.push(hightlight);
  }
  public gethighlightText(): string[] {
    return this.highlightList;
  }

  public updateComments(comment: Comment):void {
    this.commentList.push(comment);
  }

  public getCommentList(): Comment[] {
    return this.commentList;
  }
  public updatedHighlightList(highlight: string[]) {
    this.highlightList = highlight.slice();
  }

  constructor() {}
}
