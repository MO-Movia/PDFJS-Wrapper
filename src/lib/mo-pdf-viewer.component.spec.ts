import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { MoPdfViewerComponent } from './mo-pdf-viewer.component';
import { ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TagListModel, UtilService } from './util.service';
import { Observable, of } from 'rxjs';
import {
  AnnotationActionType,
  AnnotationDeleteEvent,
  AnnotationItem,
  NgxExtendedPdfViewerService,
  PageRenderEvent,
  PDFPageView,
} from 'ngx-extended-pdf-viewer';

describe('MoPdfViewerComponent', () => {
  let component: MoPdfViewerComponent;
  let fixture: ComponentFixture<MoPdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoPdfViewerComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ComponentFactoryResolver,
          useValue: {
            resolveComponentFactory: (): {
              create: () => {
                instance: { submitComment: () => Observable<unknown> };
              };
            } => {
              return {
                create: (): {
                  instance: { submitComment: () => Observable<unknown> };
                } => {
                  return {
                    instance: {
                      submitComment: (): Observable<unknown> => {
                        return of({});
                      },
                    },
                  };
                },
              };
            },
          },
        },
        {
          provide: NgxExtendedPdfViewerService,
          useValue: {
            setAnnotation: (): unknown => {
              return {};
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoPdfViewerComponent);
    component = fixture.componentInstance;

    component.utilService = {
      savedAnnotationsChange$: of({}),
      getAnnotationConfigs: () => {
        return [{}] as unknown as AnnotationItem[];
      },
      tags$: of([
        { isPrivate: true },
        { isPrivate: false },
      ] as unknown as TagListModel[]),
      getEditor: () => {
        return { pageIndex: 0, annotationConfig: { comment: 'Comment' } };
      },
      updateEditorType: () => {
        return {};
      },
      removeAnnotation: () => {},
      gethighlightText: () => {},
      getCommentList: () => {},
      addEditor: () => {},
    } as unknown as UtilService;

    fixture.detectChanges();
    const el = document.createElement('div');
    spyOn(document, 'querySelector').and.returnValue(el);
    spyOn(document, 'getElementsByClassName').and.returnValue([
      el,
    ] as unknown as HTMLCollectionOf<Element>);
    component.showTagPopover({
      id: 'id',
      type: 'Comment' as unknown as AnnotationActionType,
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should handle commentTagPopover', () => {
    expect(component.commentTagPopover({
      id: 'id',
      type: 'Comment' as unknown as AnnotationActionType,
    })).toBeUndefined();
  });
  it('should handle commentTagPopover when data.type === AnnotationActionType.tag', () => {
    expect(component.commentTagPopover({
      id: 'id',
      type: 'Tag' as unknown as AnnotationActionType,
    })).toBeUndefined();
  });
  it('should handle updateTagProps', () => {
    const spy = spyOn(component.utilService, 'updateEditorType');
    component.updateTagProps({
      pageIndex: 0,
      annotationConfig: { comment: 'Comment', Tags: [{}] },
      updateParams: () => {
        return {};
      },
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should handle updateTagProps when annotationConfig.Tags length 0', () => {
    const spy = spyOn(component.utilService, 'updateEditorType');
    component.updateTagProps({
      pageIndex: 0,
      annotationConfig: { comment: 'Comment', Tags: [] },
      updateParams: () => {
        return {};
      },
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should handle onTextLayerRendered', fakeAsync(() => {
    component.savedAnnotations = [];
    component.onTextLayerRendered({
      pageNumber: 0,
      source: {} as unknown as PDFPageView,
    });
    expect(component.savedAnnotations.length).toBe(0);
    flush();
  }));

  it('should handle onDocumentClickTag ', () => {
    const el1 = document.createElement('tag');
    const el = document.createElement('tag');
    el.appendChild(el1);
    spyOn(document, 'querySelectorAll').and.returnValue([
      el,
    ] as unknown as NodeListOf<Element>);
    component.onDocumentClickTag({} as unknown as MouseEvent);
    expect(component.isOpenTag).toBeFalse();
  });
  it('should handle onDocumentClickTag if condition ', () => {
    const el1 = document.createElement('tag');
    const el = document.createElement('tag');
    el.appendChild(el1);
    spyOn(document, 'querySelectorAll').and.returnValue([
      el,
    ] as unknown as NodeListOf<Element>);
    component.onDocumentClickTag({ target: el } as unknown as MouseEvent);
    expect(component.isOpenTag).toBeTrue();
  });
  it('should handle onDocumentClickComment  ', () => {
    const el1 = document.createElement('comment');
    const el = document.createElement('comment');
    el.appendChild(el1);
    spyOn(document, 'querySelectorAll').and.returnValue([
      el,
    ] as unknown as NodeListOf<Element>);
    component.onDocumentClickComment({ target: el } as unknown as MouseEvent);
    expect(component.isOpenComment).toBeFalse();
  });
  it('should handle onDocumentClickComment branch coverage ', () => {
    component.isOpenComment = true;
    component.onDocumentClickComment({} as unknown as MouseEvent);
    expect(component.isOpenComment).toBeFalse();
  });
  it('should handle onPdfViewerScroll   ', () => {
    expect(component.onPdfViewerScroll()).toBeUndefined();
  });
  it('should handle commntDropdownVisible   ', () => {
    const el3 = document.createElement('tag');
    spyOn(document, 'querySelectorAll').and.returnValue([
      el3,
    ] as unknown as NodeListOf<Element>);
    const el2 = document.createElement('span');
    const el1 = document.createElement('span');
    el1.querySelector = (): Element | null => {
      return el2;
    };
    const el = document.createElement('div');
    el.closest = (): Element | null => {
      return el1;
    };
    expect(component.commntDropdownVisible(el)).toBeUndefined();
  });

  it('should handle enableSubmitButton ', () => {
    const el = document.createElement('button');
    const spy = spyOn(el, 'removeAttribute');
    component.enableSubmitButton('This is a test', el);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle enableSubmitButton else condition ', () => {
    const el = document.createElement('button');
    const spy = spyOn(el, 'setAttribute');
    component.enableSubmitButton('', el);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle onPageRendered ', () => {
    expect(component.onPageRendered({
      pageNumber: null,
    } as unknown as PageRenderEvent)).toBeUndefined();
  });
  it('should handle removeTag ', () => {
    const spy = spyOn(component, 'updateTagProps');
    component.removeTag({ annotationConfig: { Tags: [] } },
      { editors: [], id: 1, name: 'name', isPrivate: true });
    expect(spy).toHaveBeenCalled();
  });
  it('should handle removeTag when Tags.length > 0', () => {
    const spy = spyOn(component, 'updateTagProps');
    component.removeTag({ annotationConfig: { Tags: [2, 3, 4] } },
      { editors: [], id: 1, name: 'name', isPrivate: true });
    expect(spy).not.toHaveBeenCalled();
  });
  it('should handle scrollToElement ', () => {
    const editor: {
      annotationConfig: { Tags: string[] };
      _uiManager: { setSelected: () => void };
    } = {
      annotationConfig: { Tags: [] },
      _uiManager: { setSelected: (): void => {} },
    };
    const spy = spyOn(editor._uiManager, 'setSelected');
    component.scrollToElement(editor);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle annotationDeleted ', () => {
    expect(component.annotationDeleted({
      id: 'id',
    } as unknown as AnnotationDeleteEvent)).toBeUndefined();
  });
  it('should handle submitComment ', () => {
    expect(component.submitComment({
      annotationConfig: { Tags: [] },
      _uiManager: { setSelected: () => {} },
    })).toBeUndefined();
  });
  it('should handle editComment ', () => {
    const editor: {
      annotationConfig: { Tags: string[] };
      _uiManager: { setSelected: () => void };
      showEdit: boolean;
    } = {
      annotationConfig: { Tags: [] },
      _uiManager: { setSelected: (): void => {} },
      showEdit: false,
    };
    component.editComment(editor);
    expect(editor.showEdit).toBeTrue();
  });
  it('should handle editComment ', () => {
    component.commentList = [{ showEdit: true }];
    const editor: {
      annotationConfig: { Tags: string[] };
      _uiManager: { setSelected: () => void };
      showEdit: boolean;
    } = {
      annotationConfig: { Tags: [] },
      _uiManager: { setSelected: (): void => {} },
      showEdit: false,
    };
    component.editComment(editor);
    expect(editor.showEdit).toBeTrue();
  });
  it('should handle removeAnnotation ', () => {
    const editor: {
      annotationConfig: { Tags: string[] };
      remove: () => void;
    } = {
      annotationConfig: { Tags: [] },
      remove: (): void => {},
    };
    const spy = spyOn(editor, 'remove');
    component.removeAnnotation(editor);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle tagPublicVisibility ', () => {
    component.publicListVisible = [false];

    component.tagPublicVisibility(0);
    expect(component.publicListVisible[0]).toBeTrue();
  });
  it('should handle tagPrivateVisibility ', () => {
    component.privateListVisible = [false];
    component.tagPrivateVisibility(0);
    expect(component.privateListVisible[0]).toBeTrue();
  });
  it('should handle onMouseEnter ', () => {
    component.onMouseEnter('private', 0);
    expect(component.hoveredList).toBe('private');
  });
  it('should handle onMouseLeave ', () => {
    component.onMouseLeave();
    expect(component.hoveredList).toBeNull();
  });
  it('should handle createPDFObject ', () => {
    const spy = spyOn(component.utilService, 'getCommentList');
    component.createPDFObject();
    expect(spy).toHaveBeenCalled();
  });
  it('should handle selectSearchCategory ', () => {
    component.selectSearchCategory('test');
    expect(component.selectedSearchCategory).toBe('test');
  });
  it('should handle showHighlightedArray ', () => {
    const spy = spyOn(component.utilService, 'addEditor');
    component.showHighlightedArray({
      annotationConfig: { Tags: [] },
      _uiManager: { setSelected: () => {} },
      showEdit: false,
    });
    expect(spy).toHaveBeenCalled();
  });
});
