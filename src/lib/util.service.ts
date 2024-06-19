import { Injectable } from '@angular/core';
import { CommentSelection } from './models/comment-selection.model';

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
  private commentList: Comment[] = [];
  private highlightList: Highlight[] = [];

  public updateTagListPrivate(tagPrivate: string) {
    this.tagListPrivate.push(tagPrivate);
  }

  public getTagListPrivate(): string[] {
    return this.tagListPrivate;
  }

  public updateTagListPublic(tagPublic: string) {
    this.tagListPublic.push(tagPublic);
  }

  public getTagListPublic(): string[] {
    return this.tagListPublic;
  }

  public updateHighlightList(hightlight: Highlight) {
    this.highlightList.push(hightlight);
  }
  public gethighlightText(): Highlight[] {
    return this.highlightList;
  }

  public updateComments(comment: Comment) {
    this.commentList.push(comment);
  }

  public getCommentList(): Comment[] {
    return this.commentList;
  }
  constructor() {}
}
