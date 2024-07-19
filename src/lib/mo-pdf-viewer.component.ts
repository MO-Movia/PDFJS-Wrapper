import {
  Component,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ElementRef,
  OnDestroy,
  Renderer2,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerComponent,
  AnnotationEditorParamsType,
  NgxExtendedPdfViewerService,
  PageRenderEvent,
  AnnotationActionType,
  ShowCommentTagPopoverDetails,
  AnnotationDeleteEvent,
} from 'ngx-extended-pdf-viewer';
import { CommentPopoverComponent } from './comment-popover/comment-popover.component';
import { TagPopoverComponent } from './tag-popover/tag-popover.component';
import {
  faFile,
  faUser,
  faMessage,
  faThumbsUp,
} from '@fortawesome/free-regular-svg-icons';
import {
  faSliders,
  faBookOpenReader,
  faQuoteRight,
  faArrowTrendUp,
  faTag,
  faTrash,
  faHighlighter,
} from '@fortawesome/free-solid-svg-icons';
import { UtilService } from './util.service';

import { FormsModule } from '@angular/forms';

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
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [provideAnimations()],
  selector: 'mo-pdf-viewer',
  templateUrl: './mo-pdf-viewer.component.html',
  styleUrls: ['./mo-pdf-viewer.component.scss'],
})
export class MoPdfViewerComponent implements OnDestroy, OnInit {
  @Input({ required: true }) public pdfSrc: string | Uint8Array = '';
  @Input() public documentTitle = '';
  @Input() public documentClassification = 'Unclassified';
  @Input() public documentAuthor = '';
  @Input() public minimalView = false;
  @Output() public annotationUpdated = new EventEmitter<any>();
  public tagListPublic: any[] = [];
  public tagListPrivate: any[] = [];
  public commentList: any[] = [];
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean = false;
  public privateListVisible: boolean = false;
  public isHovered: boolean = false;
  public isEditable: boolean[] = [];
  public newComment: string[] = [];
  highlightText: string | undefined = '';
  commentTextArray: string[] = [];
  textType: string | undefined;
  public submitSubscription: any;

  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;

  @ViewChild(TagPopoverComponent)
  public tagPopoverComponent!: TagPopoverComponent;

  public ngOnInit(): void {
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.offsetParent.children[5].style.display ='none';
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('keydown', this.onKeyDown);
  }
  private popoverRef: any;
  private previousScrollTop = 0;
  private previousScrollLeft = 0;
  public highlightList: any[] = [];
  public dropdownVisible: any = {};
  public hoveredList: 'private' | 'public' | null | 'highlight' = null;
  public hoveredIndex: number | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public utilService: UtilService,
    public renderer: Renderer2,
    private pdfService: NgxExtendedPdfViewerService
  ) {
    this.utilService.annotationUpdated$.subscribe(() => {
      this.createPDFObject();
    });
  }

  public createPDFObject(): void {
    this.highlightList = this.utilService.gethighlightText();
    this.tagListPublic = this.utilService.getTagListPublic();
    this.tagListPrivate = this.utilService.getTagListPrivate();
    this.commentList = this.utilService.getCommentList();
  }

  public I = {
    faFile,
    faUser,
    faSliders,
    faBookOpenReader,
    faMessage,
    faQuoteRight,
    faArrowTrendUp,
    faThumbsUp,
    faTag,
    faTrash,
    faHighlighter,
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
      label: 'Comments',
      icon: faMessage,
    },
  ];

  public selectedSearchCategory = 'Highlights';

  public selectSearchCategory(category: string): void {
    this.selectedSearchCategory = category;
  }

  public showHighlightedArray(editor: any) {
    this.annotationUpdated.emit(editor);
    this.utilService.addEditor(editor);
  }

  @HostListener('keydown', ['$event'])
  onKey(event: KeyboardEvent, i: number) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const value = textarea.value;
        const newValue = value.substring(0, start) + value.substring(end);
        this.newComment[i] = newValue;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start;
        }, 0);
      } else if (start > 0) {
        const value = textarea.value;
        const newValue = value.substring(0, start - 1) + value.substring(end);
        this.newComment[i] = newValue;

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
      }
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public commentTagPopover(data: ShowCommentTagPopoverDetails): void {
    console.log('commentTagPopover called with data:', data);
    const editor = this.utilService.getEditor(data.id);
    if (data.type === AnnotationActionType.comment) {
      this.showCommentPopover(editor);

      const commentPopoverInstance = this.popoverRef
        .instance as CommentPopoverComponent;
      commentPopoverInstance.comment = editor.comment;
      commentPopoverInstance.submitComment.subscribe(() => {
        editor.updateParams(
          AnnotationEditorParamsType.HIGHLIGHT_COLOR,
          '#80EBFF'
        );
        editor.type = AnnotationActionType.comment;
        editor.comment = commentPopoverInstance.comment;
        this.utilService.updateEditorType(editor);
      });
    } else if (
      data.type === AnnotationActionType.privateTag ||
      data.type === AnnotationActionType.publicTag
    ) {
      this.showTagPopover(editor);
      const tagPopoverInstance = this.popoverRef
        .instance as TagPopoverComponent;
      tagPopoverInstance.submitTag.subscribe(() => {
        editor.updateParams(
          AnnotationEditorParamsType.HIGHLIGHT_COLOR,
          '#53FFBC'
        );
        if (tagPopoverInstance.selectedTag === 'Public') {
          editor.type = AnnotationActionType.publicTag;
        } else if (tagPopoverInstance.selectedTag === 'Private') {
          editor.type = AnnotationActionType.privateTag;
        }
        this.utilService.updateEditorType(editor);
      });
    }
  }

  public showTagPopover(editor: any): void {
    this.closeCommentPopover();
    this.isOpenTag = true;
    const popoverFactory =
      this.resolver.resolveComponentFactory(TagPopoverComponent);
    this.popoverRef = popoverFactory.create(this.injector);
    this.appRef.attachView(this.popoverRef.hostView);
    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;
    popoverElement.style.display = 'block';

    const selectedText = document.querySelector(
      '.highlightEditor.selectedEditor'
    ) as HTMLElement;
    selectedText.appendChild(popoverElement);
    const selectedTextRect = selectedText.getBoundingClientRect();
    const targetPageIndex = editor.pageIndex; 
    const pageElement = document.getElementsByClassName('textLayer')[targetPageIndex];    
    if (pageElement) {
      const pageRect = pageElement.getBoundingClientRect();
      popoverElement.style.position = 'absolute';
      if (selectedTextRect.bottom > pageRect.bottom - 195) {
        popoverElement.style.top = 'calc(100% - 184px)';
      } else {
        popoverElement.style.top = '60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickTag);
  }

  public showCommentPopover(editor: any): void {
    this.closeCommentPopover();
    this.isOpenComment = true;
    const popoverFactory = this.resolver.resolveComponentFactory(
      CommentPopoverComponent
    );
    this.popoverRef = popoverFactory.create(this.injector);
    this.appRef.attachView(this.popoverRef.hostView);
    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;
    popoverElement.style.display = 'block';

    const selectedText = document.querySelector(
      '.highlightEditor.selectedEditor'
    ) as HTMLElement;
    selectedText.appendChild(popoverElement);
    const selectedTextRect = selectedText.getBoundingClientRect();
    const targetPageIndex = editor.pageIndex; 
    const pageElement = document.getElementsByClassName('textLayer')[targetPageIndex]; 
    if (pageElement) {
      const pageRect = pageElement.getBoundingClientRect();
      popoverElement.style.position = 'absolute';
      if (selectedTextRect.bottom > pageRect.bottom - 210) {
        popoverElement.style.top = 'calc(100% - 218px)';
      } else {
        popoverElement.style.top = '60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickComment);
  }

  public onPageRendered(event: PageRenderEvent): void {
    this.pdfService.setAnnotation([
      {
        spanIndex: 32,
        rangeStart: 5,
        rangeEnd: 12,
        color: '#80EBFF',
        pageNumber: 1,
      },
    ]);
  }

  public onDocumentClickTag = (event: MouseEvent): void => {
    if (this.popoverRef && this.popoverRef.hostView) {
      const clickedInsidePopover =
        this.popoverRef.hostView.rootNodes[0].contains(event.target as Node);
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
    if (this.popoverRef && this.popoverRef.hostView) {
      const clickedInsidePopover =
        this.popoverRef.hostView.rootNodes[0].contains(event.target as Node);

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

  public scrollToElement(id: string): void {
    document.getElementById(`${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
    index: number,
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

  public annotationDeleted(event: AnnotationDeleteEvent) {
    this.utilService.removeAnnotation(event.id);
  }

  public submitComment(
    index: number,
    submitButton: HTMLButtonElement,
    editor: any
  ): void {
    if (this.newComment[index].trim()) {
      editor.comment = this.newComment[index];
      this.newComment[index] = '';
    }

    this.isEditable[index] = false;
    submitButton.setAttribute('disabled', 'true');
  }

  public editComment(index: number, comment: string): void {
    this.newComment[index] = comment;
    this.isEditable[index] = true;
  }

  public removeAnnotation(editor: any) {
    editor.remove(editor);
  }

  public closeCommentTextarea(index: number): void {
    this.isEditable[index] = false;
  }

  public tagPublicVisibility(): void {
    this.publicListVisible = !this.publicListVisible;
  }

  public tagPrivateVisibility(): void {
    this.privateListVisible = !this.privateListVisible;
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
    this.closeCommentPopover;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('keydown', this.onKeyDown);
  }
}
