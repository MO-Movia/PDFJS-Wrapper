import { Injectable } from '@angular/core';

export interface Tag {
  tagType: string;
  tagText: string;
}

export interface Comment {
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
  private tagList: Tag[] = [];
  private commentList: Comment[] = [];
  private highlightList: Highlight[] = [];

  public updateTagList(tag: Tag) {
    this.tagList.push(tag);
  }

  public getTagList(): Tag[] {
    return this.tagList;
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
