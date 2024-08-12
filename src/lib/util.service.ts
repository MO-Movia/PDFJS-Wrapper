import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnnotationActionType, AnnotationItem } from 'ngx-extended-pdf-viewer';

export interface TagModel {
  id: number;
  name: string;
  isPrivate: boolean;
  isChecked?: boolean;
}
export interface TagListModel extends TagModel {
  editors: any[];
}
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public annotations: any[] = [];
  public tags = new BehaviorSubject<TagListModel[]>([]);
  tags$ = this.tags.asObservable();
  private annotationUpdated = new Subject<void>();
  annotationUpdated$ = this.annotationUpdated.asObservable();

  annotationDataUpdated() {
    this.annotationUpdated.next();
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
    if (editor.annotationConfig?.Tags?.length > 0) {
      this.updateRightPanelTags();
    }
  }

  public getEditor(id: string): any {
    return this.annotations.find((t) => t.id === id);
  }

  public updateEditorType(editor: any): void {
    const editorIndex = this.annotations.findIndex((t) => t.id === editor.id);
    if (editorIndex > -1) {
      this.annotations[editorIndex] = editor;
      this.annotationDataUpdated();

      this.updateRightPanelTags();
    }
  }

  public removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter((a) => a.id != id);
    this.annotationDataUpdated();
    this.updateRightPanelTags();
  }
  private updateRightPanelTags() {
    this.tags.next(this.getTagList());
  }
  public getAnnotationConfigs(): AnnotationItem[] {
    return this.annotations.map((a) => a.annotationConfig);
  }

  // public getTagListPrivate(): TagModel[] {
  //   const tags = this.getAnnotatedTags();
  //   return tags.filter((tag) => tag.isPrivate);
  // }

  // public getTagListPublic(): TagModel[] {
  //   const tags = this.getAnnotatedTags();
  //   return tags.filter((tag) => !tag.isPrivate);
  // }

  public getTagList(): TagListModel[] {
    const matchingTags: TagListModel[] = [];

    this.getTags().forEach((tag) => {
      const annotations = this.annotations.filter((d) =>
        d.annotationConfig.Tags.includes(tag.id)
      );
      if (annotations.length > 0) {
        matchingTags.push({
          ...tag,
          editors: annotations,
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
