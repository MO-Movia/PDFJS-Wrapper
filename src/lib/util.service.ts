import { Injectable } from '@angular/core';
import { CommentSelection } from './models/comment-selection.model';
import { SpanLocation } from './models/span-location.model';
import { Subject } from 'rxjs';

export interface Comment extends CommentSelection {
  text: string;
  comment: string;
}
export interface AnnotationSelection {
  id: string;
  text: string[] ;
  comment: string;
  editMode: boolean;
  isHovered:boolean;
  spanLocations: SpanLocation[],
  spanIndex : number;
  rangeStart : number;
  rangeEnd : number;
}
export interface Highlight {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public tagListPrivate: AnnotationSelection ={
    id: '',
    text: [] ,
    comment: '',
    editMode: false,
    isHovered: false,
    spanLocations: [],
    spanIndex: 0,
    rangeStart: 0,
    rangeEnd: 0
  }; ;
  public tagListPublic: AnnotationSelection={
    id: '',
    text: [] ,
    comment: '',
    editMode: false,
    isHovered: false,
    spanLocations: [],
    spanIndex: 0,
    rangeStart: 0,
    rangeEnd: 0
  };;
  public commentList: AnnotationSelection={
    id: '',
    text: [] ,
    comment: '',
    editMode: false,
    isHovered: false,
    spanLocations: [],
    spanIndex: 0,
    rangeStart: 0,
    rangeEnd: 0
  };;
  public highlightList: AnnotationSelection={
    id: '',
    text: [] ,
    comment: '',
    editMode: false,
    isHovered: false,
    spanLocations: [],
    spanIndex: 0,
    rangeStart: 0,
    rangeEnd: 0
  };
  
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
    this.tagListPrivate.text.push(tagPrivate);
    
  }

  public getTagListPrivate(): AnnotationSelection {
    return this.tagListPrivate;
  }

  public updateTagListPublic(tagPublic: string):void {
    this.tagListPublic.text.push(tagPublic);
  }

  public getTagListPublic(): AnnotationSelection{
    return this.tagListPublic;
  }

  public updateHighlightList(hightlight: string) {
    this.highlightList.text.push(hightlight);
  }
  public gethighlightText(): AnnotationSelection {
    return this.highlightList;
  }

  public updateComments(comment: string):void {
    this.commentList.text.push(comment);
  }

  public getCommentList(): AnnotationSelection {
    return this.commentList;
  }
  public updatedHighlightList(highlight: AnnotationSelection) {
    this.highlightList.text = highlight.text.slice();
  }

  constructor() {}
}
