import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnnotationActionType, AnnotationItem } from 'ngx-extended-pdf-viewer';
export interface TagModel {
  id: number;
  name: string;
  isPrivate: boolean;
  text?: string;
  editorId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public annotations: any[] = [];
  public uniqueTagIds: any;
  public uniqueTags: any;
  // public matchingTags:TagModel[] =[]
  public newTag: TagModel[] = [];

  private annotationUpdated = new Subject<void>();
  annotationUpdated$ = this.annotationUpdated.asObservable();

  public _selectedTags = new BehaviorSubject<any[]>([]);
  selectedTags$ = this._selectedTags.asObservable();

  updateSelectedTags(tags: any[]) {
    this._selectedTags.next(tags);
  }

  // private checkboxData = new Subject<void>();
  // checkboxData$ = this.checkboxData.asObservable();

  // public checkboxUpdated(){
  //   this.checkboxData.next();
  // }
  annotationDataUpdated() {
    this.annotationUpdated.next();
  }

  public getTagListPrivate(): TagModel[] {
    const tags = this.getAnnotatedTags();
    return tags.filter((tag) => tag.isPrivate);
  }
  public getTagListPublic(): TagModel[] {
    const tags = this.getAnnotatedTags();
    return tags.filter((tag) => !tag.isPrivate);
  }

  public gethighlightText(): any[] {
    return this.annotations.filter(
      (t) => t.annotationConfig.type === AnnotationActionType.highlight
    );
  }

  public getCommentList(): any[] {
    return this.annotations.filter(
      (t) => t.annotationConfig.type === AnnotationActionType.comment
    );
  }

  public addEditor(editor: any): void {
    this.annotations.push(editor);
    this.annotationDataUpdated();
  }

  public getEditor(id: string): any {
    return this.annotations.find((t) => t.id === id);
  }

  public updateEditorType(editor: any): void {
    const editorIndex = this.annotations.findIndex((t) => t.id === editor.id);
    if (editorIndex > -1) {
      this.annotations[editorIndex] = editor;
      this.annotationDataUpdated();
    }
  }

  public removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter((a) => a.id != id);
    this.annotationDataUpdated();
  }

  public getAnnotationConfigs(): AnnotationItem[] {
    return this.annotations.map((a) => a.annotationConfig);
  }

  public getAnnotatedTags(): TagModel[] {
    const allTags = this.getTags();
    const matchingTags: TagModel[] = [];
    this.annotations.forEach((annotation) => {
      if (annotation.annotationConfig.Tags) {
        annotation.annotationConfig.Tags.forEach((tagId: { id: number }) => {
          const matchingTag = allTags.find((tag) => tag.id === tagId.id);
          if (matchingTag) {
            matchingTag.text = annotation?.text || '';
            matchingTags.push({ ...matchingTag });
          }
        });
      }
    });

    return matchingTags;
  }

  public getTags(): TagModel[] {
    return [
      { id: 1, name: 'PriTag1', isPrivate: true },
      { id: 2, name: 'PriTag2', isPrivate: true },
      { id: 3, name: 'PriTag3', isPrivate: true },
      { id: 4, name: 'PubTag1', isPrivate: false },
      { id: 5, name: 'PubTag2', isPrivate: false },
      { id: 6, name: 'PubTag3', isPrivate: false },
    ];
  }

  constructor() {}
}
