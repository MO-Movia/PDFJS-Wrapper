import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ApplicationRef,
  ElementRef,
  OnDestroy,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
  ComponentRef,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import {
  NgbNavModule,
  NgbTooltipModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerComponent,
  AnnotationEditorParamsType,
  NgxExtendedPdfViewerService,
  PageRenderEvent,
  AnnotationActionType,
  ShowCommentTagPopoverDetails,
  AnnotationDeleteEvent,
  AnnotationItem,
  highlightEditor,
} from 'ngx-extended-pdf-viewer';
import { CommentPopoverComponent } from './comment-popover/comment-popover.component';
import { TagPopoverComponent } from './tag-popover/tag-popover.component';
import {
  faTag,
  faTrash,
  faHighlighter,
  faMessage,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { UtilService, TagListModel } from './util.service';

import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    AngularSplitModule,
    NgbNavModule,
    NgbTooltipModule,
    NgxExtendedPdfViewerModule,
    NgbModule,
    FormsModule,
  ],
  providers: [provideAnimations(), UtilService],
  selector: 'mo-pdf-viewer',
  templateUrl: './mo-pdf-viewer.component.html',
  styleUrls: ['./mo-pdf-viewer.component.scss'],
})
export class MoPdfViewerComponent implements OnDestroy, OnInit {
  @Input({ required: true }) public pdfSrc: string | Uint8Array = '';
  @Input() public set annotations(savedAnnotations: AnnotationItem[]) {
    if (savedAnnotations && savedAnnotations.length > 0) {
      this.savedAnnotations = savedAnnotations;
      this.notRenderedPages = [
        ...new Set(this.savedAnnotations.map((a) => a.pageNumber)),
      ];

      this.requestedPages = [...this.notRenderedPages];
    }
  }
  @Input() public activePageNumber : number = 1; 
  @Output() public pageChange = new EventEmitter <number>(); 
  @Output() public savedAnnotationsChange = new EventEmitter<AnnotationItem[]>();
  @Input() public scrollTop : number = 1;
  public savedAnnotations: AnnotationItem[] = [];
  public tagListPublic: TagListModel[] = [];
  public tagListPrivate: TagListModel[] = [];
  public commentList: highlightEditor[] = [];
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean[] = [];
  public privateListVisible: boolean[] = [];
  public showRightPanel : boolean = true;

  private notRenderedPages: number[] = [];

  private requestedPages: number[] = [];
  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;

  @ViewChild(TagPopoverComponent)
  public tagPopoverComponent!: TagPopoverComponent;

  public ngOnInit(): void {
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
  }

  private popoverRef: ComponentRef<
    CommentPopoverComponent | TagPopoverComponent
  > | null = null;
  public previousScrollTop = 0;
  public previousScrollLeft = 0;
  public highlightList: highlightEditor[] = [];
  public hoveredList: 'private' | 'public' | null | 'highlight' = null;
  public hoveredIndex: number | null = null;
  private callExecuted: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public utilService: UtilService,
    public renderer: Renderer2,
    private pdfService: NgxExtendedPdfViewerService
  ) {
    this.privateListVisible = new Array(this.tagListPrivate.length).fill(false);
    this.utilService.savedAnnotationsChange$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.createPDFObject();
        this.savedAnnotationsChange.emit(this.utilService.getAnnotationConfigs());
      });
    this.utilService.tags$.pipe(takeUntilDestroyed()).subscribe((tags) => {
      this.tagListPublic = tags.filter((tag) => !tag.isPrivate);
      this.tagListPrivate = tags.filter((tag) => tag.isPrivate);
    });
  }

  public createPDFObject(): void {
    this.highlightList = this.utilService.gethighlightText();
    this.commentList = this.utilService.getCommentList();
  }

  public I = {
    faMessage,
    faTag,
    faTrash,
    faHighlighter,
    faBars
  };

  public searchCategories = [
    {
      label: 'Highlights',
      icon: faHighlighter,
    },
    {
      label: 'Tags',
      icon: faTag,
    },
    {
      label: 'Notes',
      icon: faMessage,
    },
  ];

  public toggleRightPanel(){
    this.showRightPanel = !this.showRightPanel;
  }

  public selectedSearchCategory = 'Highlights';

  public onPageChange(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }

  public selectSearchCategory(category: string): void {
    this.selectedSearchCategory = category;
  }

  public showHighlightedArray(editor: highlightEditor): void {
    this.utilService.addEditor(editor);
  }
  
  public commentTagPopover(data: ShowCommentTagPopoverDetails): void {
    const editor = this.utilService.getEditor(data.id);
    if (data.type === AnnotationActionType.comment) {
      this.showCommentPopover(editor);

      const commentPopoverInstance = this.popoverRef
        ?.instance as CommentPopoverComponent;
      commentPopoverInstance.comment = editor.annotationConfig.comment;
      commentPopoverInstance.submitComment.subscribe(() => {
        editor.updateParams(
          AnnotationEditorParamsType.HIGHLIGHT_COLOR,
          '#80EBFF'
        );
        editor.type = AnnotationActionType.comment;
        editor.annotationConfig.type = AnnotationActionType.comment;
        editor.annotationConfig.comment = commentPopoverInstance.comment;
        editor.annotationConfig.color = '#80EBFF';
        editor.annotationConfig.Tags = [];
        this.utilService.updateEditorType(editor);
      });
    } else if (data.type === AnnotationActionType.tag) {
      this.showTagPopover(editor);
      const tagPopoverInstance = this.popoverRef
        ?.instance as TagPopoverComponent;
      tagPopoverInstance.tagSelected.subscribe((activeEditor) => {
        editor.annotationConfig.Tags = activeEditor.annotationConfig.Tags;
        editor.annotationConfig.comment = '';
        this.updateTagProps(editor);
      });
    }
  }

  public updateTagProps(editor: highlightEditor): void {
    if (editor.annotationConfig.Tags.length > 0) {
      editor.updateParams(
        AnnotationEditorParamsType.HIGHLIGHT_COLOR,
        '#53FFBC'
      );
      editor.type = AnnotationActionType.tag;
      editor.annotationConfig.color = '#53FFBC';
      editor.annotationConfig.type = AnnotationActionType.tag;
      this.utilService.updateEditorType(editor);
    } else {
      editor.updateParams(
        AnnotationEditorParamsType.HIGHLIGHT_COLOR,
        '#FFFF98'
      );
      editor.type = AnnotationActionType.highlight;
      editor.annotationConfig.color = '#FFFF98';
      editor.annotationConfig.type = AnnotationActionType.highlight;
      this.utilService.updateEditorType(editor);
    }
  }

  public showTagPopover(editor: highlightEditor): void {
    this.closeCommentPopover();
    this.isOpenTag = true;

    this.popoverRef =
      this.viewContainerRef.createComponent(TagPopoverComponent);
    (this.popoverRef.instance as TagPopoverComponent).editor = editor;

    const popoverElement = this.popoverRef.location
      .nativeElement as HTMLElement;
    popoverElement.style.display = 'block';

    const selectedText = document.querySelector(
      '.highlightEditor.selectedEditor'
    ) as HTMLElement;
    selectedText.appendChild(popoverElement);
    const selectedTextRect = selectedText.getBoundingClientRect();
    const targetPageIndex = editor.pageIndex;
    const pageElement =
      document.getElementsByClassName('textLayer')[targetPageIndex];
    if (pageElement) {
      const pageRect = pageElement.getBoundingClientRect();
      popoverElement.style.position = 'absolute';
      if (selectedTextRect.bottom > pageRect.bottom - 260) {
        popoverElement.style.top = 'calc(100% - 264px)';
      } else {
        popoverElement.style.top = '60px';
      }

      if (selectedTextRect.left > pageRect.left - 173) {
        popoverElement.style.left = 'calc(100% - 80px)';
      } else {
        popoverElement.style.left = '-60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickTag);
  }

  public showCommentPopover(editor: highlightEditor): void {
    this.closeCommentPopover();
    this.isOpenComment = true;
    this.popoverRef = this.viewContainerRef.createComponent(
      CommentPopoverComponent
    );
    const popoverElement = this.popoverRef.location
      .nativeElement as HTMLElement;
    popoverElement.style.display = 'block';

    const selectedText = document.querySelector(
      '.highlightEditor.selectedEditor'
    ) as HTMLElement;
    selectedText.appendChild(popoverElement);
    const selectedTextRect = selectedText.getBoundingClientRect();
    const targetPageIndex = editor.pageIndex;
    const pageElement =
      document.getElementsByClassName('textLayer')[targetPageIndex];
    if (pageElement) {
      const pageRect = pageElement.getBoundingClientRect();
      popoverElement.style.position = 'absolute';
      if (selectedTextRect.bottom > pageRect.bottom - 270) {
        popoverElement.style.top = 'calc(100% - 264px)';
      } else {
        popoverElement.style.top = '60px';
      }
      if (selectedTextRect.left > pageRect.left - 173) {
        popoverElement.style.left = 'calc(100% - 80px)';
      } else {
        popoverElement.style.left = '-60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickComment);
  }

  public onTextLayerRendered(event: PageRenderEvent): void {
    this.savedAnnotations.sort((a, b) => a.pageNumber - b.pageNumber);
    const pdfContainer = document.querySelector('#viewerContainer');
    setTimeout(() => {
      this.notRenderedPages = this.notRenderedPages.filter(
        (p) => p !== event.pageNumber
      );
       this.pdfService.setAnnotation(this.savedAnnotations);
      if (
        this.notRenderedPages.length === 0 &&
        this.savedAnnotations.length > 0 &&
        !this.callExecuted
      ) {
        setTimeout(() => {
          if (pdfContainer) {
            pdfContainer.scrollTo({
              top: this.scrollTop,
              behavior: 'smooth', 
            });
          }  
          this.callExecuted = true;
        }, 200); 
      }

      if(this.savedAnnotations.length === 0 && !this.callExecuted ){
          setTimeout(() => {
            if (pdfContainer) {
              pdfContainer.scrollTo({
                top: this.scrollTop,
                behavior: 'smooth', 
              });
            }  
            this.callExecuted = true;
          }, 200);      
      }
    }, 500);
  }
  public onPageRendered(event: PageRenderEvent): void {
    this.requestedPages = this.requestedPages.filter(
      (d) => d !== event.pageNumber
    );
    this.savedAnnotations.sort((a, b) => a.pageNumber - b.pageNumber);

    if (this.pdfService.isRenderQueueEmpty()) {
      this.requestedPages.forEach((d) => {
        this.pdfService.addPageToRenderQueue(d - 1);
      });
    }
  }
  public removeTag(editor: highlightEditor, tag: TagListModel): void {
    editor.annotationConfig.Tags = editor.annotationConfig.Tags.filter(
      (t: number) => t !== tag.id
    );
    this.utilService.updateEditorType(editor);
    if (editor.annotationConfig.Tags.length === 0) {
      this.updateTagProps(editor);
    }
  }

  public onDocumentClickTag = (event: MouseEvent): void => {
    if (this.popoverRef?.hostView) {
      const clickedInsidePopover = (
        this.popoverRef.location.nativeElement as HTMLElement
      ).contains(event.target as Node);

      const tagElements = document.querySelectorAll('.tag');
      let clickedInsideTag = false;

      tagElements.forEach((tagElement) => {
        if (tagElement.contains(event.target as Node)) {
          clickedInsideTag = true;
        }
      });
      if (!clickedInsidePopover && !clickedInsideTag) {
        const popover = document.querySelector('.tag-popover') as HTMLElement;

        if (this.isOpenTag && popover) {
          popover.style.display = 'none';
        }
        this.isOpenTag = false;
      }
    }
  };
  public onDocumentClickComment = (event: MouseEvent): void => {
    if (this.popoverRef?.hostView) {
      const clickedInsidePopover = (
        this.popoverRef.location.nativeElement as HTMLElement
      ).contains(event.target as Node);

      const commentElements = document.querySelectorAll('.comment');
      let clickedInsidecomment = false;

      commentElements.forEach((commentElement) => {
        if (commentElement.contains(event.target as Node)) {
          clickedInsidecomment = true;
        }
      });

      if (!clickedInsidePopover && !clickedInsidecomment) {
        const popover = document.querySelector(
          '.comment-popover-content'
        ) as HTMLElement;

        if (this.isOpenComment && popover) {
          popover.style.display = 'none';
        }
        this.isOpenComment = false;
      }
    }
  };

  public scrollToElement(editor: highlightEditor): void {
    document.getElementById(`${editor.id}`)?.scrollIntoView({
      block: 'center',
      inline: 'center',
    });

    editor._uiManager.setSelected(editor);
  }

  public onPdfViewerScroll = (): void => {
    if (this.popoverRef) {
      const pdfViewerElement = this.elementRef.nativeElement.querySelector(
        'ngx-extended-pdf-viewer'
      );
      this.previousScrollTop = pdfViewerElement.scrollTop;
      this.previousScrollLeft = pdfViewerElement.scrollLeft;
    }
  };

  public closeCommentPopover(): void {
    if (this.popoverRef) {
      this.appRef.detachView(this.popoverRef.hostView);
      this.popoverRef.destroy();
      this.popoverRef = null;
      const pdfViewerElement = this.elementRef.nativeElement.querySelector(
        'ngx-extended-pdf-viewer'
      );
      pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    }
  }

  public commntDropdownVisible(element: HTMLElement): void {
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    allDropdowns.forEach((dropdown) => {
      (dropdown as HTMLElement).style.display = 'none';
    });
    const parentSpan = element.closest('.icon-span');
    if (parentSpan) {
      const dropdownContent = parentSpan.querySelector(
        '.dropdown-content'
      ) as HTMLElement;
      if (dropdownContent) {
        dropdownContent.style.display = 'block';
        const hideDropdown = (event: MouseEvent): void => {
          if (!parentSpan.contains(event.target as Node)) {
            dropdownContent.style.display = 'none';
            document.removeEventListener('click', hideDropdown);
          }
        };
        setTimeout(() => {
          document.addEventListener('click', hideDropdown);
        }, 0);
      }
    }
  }

  public enableSubmitButton(
    comment: string,
    submitButton: HTMLButtonElement
  ): void {
    const textAreaValue = comment && comment.trim().length > 0;
    if (submitButton) {
      if (textAreaValue) {
        submitButton.removeAttribute('disabled');
        submitButton.style.background = '#545050';
      } else {
        submitButton.setAttribute('disabled', 'true');
      }
    }
  }

  public annotationDeleted(event: AnnotationDeleteEvent): void {
    this.utilService.removeAnnotation(event.id);
  }

  public submitComment(editor: highlightEditor): void {
    editor.annotationConfig.comment = editor.tempComment;
    editor.showEdit = false;
  }

  public editComment(editor: highlightEditor): void {
    this.commentList.forEach((c) => (c.showEdit = false));
    editor.tempComment = editor.annotationConfig.comment;
    editor.showEdit = true;
  }

  public removeAnnotation(editor: highlightEditor): void {
    editor.remove(editor);
  }

  public tagPublicVisibility(index: number): void {
    this.publicListVisible[index] = !this.publicListVisible[index];
  }

  public tagPrivateVisibility(index: number): void {
    this.privateListVisible[index] = !this.privateListVisible[index];
  }

  public onMouseEnter(
    list: 'private' | 'public' | 'highlight',
    index: number
  ): void {
    this.hoveredIndex = index;
    this.hoveredList = list;
  }

  public onMouseLeave(): void {
    this.hoveredIndex = null;
    this.hoveredList = null;
  }

  public ngOnDestroy(): void {
    this.closeCommentPopover();
    this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
  }
}
