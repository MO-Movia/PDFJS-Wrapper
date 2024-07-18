import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AnnotationActionType } from 'ngx-extended-pdf-viewer';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public annotations: any[] = [];

  private annotationUpdated = new Subject<void>();
  annotationUpdated$ = this.annotationUpdated.asObservable();

  annotationDataUpdated() {
    this.annotationUpdated.next();
  }

  public getTagListPrivate(): any[] {
    return this.annotations.filter(
      (t) => t.type === AnnotationActionType.privateTag
    );
  }

  public getTagListPublic(): any[] {
    return this.annotations.filter(
      (t) => t.type === AnnotationActionType.publicTag
    );
  }

  public gethighlightText(): any[] {
    return this.annotations.filter(
      (t) => t.type === AnnotationActionType.highlight
    );
  }

  public getCommentList(): any[] {
    return this.annotations.filter(
      (t) => t.type === AnnotationActionType.comment
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
    if (editorIndex) {
      this.annotations[editorIndex] = editor;
      this.annotationDataUpdated();
    }
  }

  public removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter((a) => a.id != id);
    this.annotationDataUpdated();
  }

  public getTags(): { name: string; isPrivate: boolean }[] {
    return [
      { name: 'tag1', isPrivate: false },
      { name: 'tag2', isPrivate: false },
      { name: 'tag3', isPrivate: false },
      { name: 'tag4', isPrivate: true },
      { name: 'tag5', isPrivate: true },
    ];
  }

  constructor() {}
}
