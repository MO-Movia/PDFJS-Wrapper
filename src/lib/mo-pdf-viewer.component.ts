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
  PagesLoadedEvent,
  AnnotationActionType,
  ShowCommentTagPopoverDetails,
  AnnotationDeleteEvent,
  AnnotationItem,
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
import { TagModel, UtilService } from './util.service';

import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  providers: [provideAnimations(), UtilService],
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
  private _isFirstEditor: any;
  @Input() set annotations(savedAnnotations: AnnotationItem[]) {
    if (savedAnnotations && savedAnnotations.length > 0) {
      this.savedAnnotations = savedAnnotations;
      this.notRenderedPages = [
        ...new Set(this.savedAnnotations.map((a) => a.pageNumber)),
      ];

      this.requestedPages = [...this.notRenderedPages];
    }
  }
  @Input() public savedAnnotations: AnnotationItem[] = [];
  @Output() public annotationUpdated = new EventEmitter<AnnotationItem[]>();
  public tagListPublic: any[] = [];
  public tagListPrivate: any[] = [];
  public commentList: any[] = [];
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean[] = [];
  public privateListVisible: boolean[] = [];
  public isHovered: boolean = false;
  public tags: TagModel[] = [];
  //public isEditable: boolean[] = [];
  // public newComment: string = '';
  highlightText: string | undefined = '';
  commentTextArray: string[] = [];
  textType: string | undefined;
  public submitSubscription: any;
  private notRenderedPages: number[] = [];
  public subscription: Subscription | undefined;
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
    //pdfViewerElement.addEventListener('keydown', this.onKeyDown);
  }

  private popoverRef: any;
  private previousScrollTop = 0;
  private previousScrollLeft = 0;
  public highlightList: any[] = [];
  public dropdownVisible: any = {};
  public hoveredList: 'private' | 'public' | null | 'highlight' = null;
  public hoveredIndex: number | null = null;
  private callExecuted: boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public utilService: UtilService,
    public renderer: Renderer2,
    private pdfService: NgxExtendedPdfViewerService
  ) {

    this.privateListVisible = new Array(this.tagListPrivate.length).fill(false);

    this.utilService.annotationUpdated$.subscribe(() => {
      this.createPDFObject();
      this.annotationUpdated.emit(this.utilService.getAnnotationConfigs());
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
      label: 'Notes',
      icon: faMessage,
    },
  ];

  public selectedSearchCategory = 'Highlights';

  public selectSearchCategory(category: string): void {
    this.selectedSearchCategory = category;
  }

  public showHighlightedArray(editor: any) {
    this.utilService.addEditor(editor);
  }

  public commentTagPopover(data: ShowCommentTagPopoverDetails): void {
    console.log('commentTagPopover called with data:', data);
    const editor = this.utilService.getEditor(data.id);
    if (data.type === AnnotationActionType.comment) {
      this.showCommentPopover(editor);

      const commentPopoverInstance = this.popoverRef
        .instance as CommentPopoverComponent;
      commentPopoverInstance.comment = editor.annotationConfig.comment;
      commentPopoverInstance.submitComment.subscribe(() => {
        editor.updateParams(
          AnnotationEditorParamsType.HIGHLIGHT_COLOR,
          '#80EBFF'
        );
        editor.annotationConfig.type = AnnotationActionType.comment;
        editor.annotationConfig.comment = commentPopoverInstance.comment;
        editor.annotationConfig.color = '#80EBFF';
        this.utilService.updateEditorType(editor);
      });
    } else if (
      data.type === AnnotationActionType.tag 
    ) {
      this.showTagPopover(editor);
      const tagPopoverInstance = this.popoverRef
        .instance as TagPopoverComponent;
    

      tagPopoverInstance.tagSelected.subscribe(() => {
        this.subscription = this.utilService.selectedTags$.subscribe((tags) => {
            const filteredTags = tags.filter((tag) => tag.editorId === editor.id);
            editor.annotationConfig.Tags = filteredTags
            .map((tag) => ({ id: tag.id }));
           if (filteredTags.some((tag) => tag.isChecked)) {
              editor.updateParams(
                      AnnotationEditorParamsType.HIGHLIGHT_COLOR,
                      '#53FFBC'
                    );
                    editor.annotationConfig.color = '#53FFBC';     
                    editor.annotationConfig.type=AnnotationActionType.tag      
                    this.utilService.updateEditorType(editor);
            } else {
              editor.updateParams(
                AnnotationEditorParamsType.HIGHLIGHT_COLOR,
                "#FFFF98"
              );
              editor.annotationConfig.type=AnnotationActionType.highlight
              this.utilService.updateEditorType(editor);
              
            }
            
          
          this.utilService.getAnnotatedTags();
          this.tagListPrivate = this.utilService.getTagListPrivate();
          this.tagListPublic = this.utilService.getTagListPublic();
        });

      //   tagPopoverInstance.submitTag.subscribe(() => {
      //     editor.updateParams(
      //       AnnotationEditorParamsType.HIGHLIGHT_COLOR,
      //       '#53FFBC'
      //     );
      //     editor.annotationConfig.color = '#53FFBC';
      //     // this.utilService.updateEditorType(editor);
      //   });
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
    this.popoverRef.instance.editorId = editor.id;

    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;
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
      if (selectedTextRect.bottom > pageRect.bottom - 195) {
        popoverElement.style.top = 'calc(100% - 184px)';
      } else {
        popoverElement.style.top = '60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
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
    const pageElement =
      document.getElementsByClassName('textLayer')[targetPageIndex];
    if (pageElement) {
      const pageRect = pageElement.getBoundingClientRect();
      popoverElement.style.position = 'absolute';
      if (selectedTextRect.bottom > pageRect.bottom - 210) {
        popoverElement.style.top = 'calc(100% - 218px)';
      } else {
        popoverElement.style.top = '60px';
      }
    }
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickComment);
  }

  public onTextLayerRendered(event: any): void {
    this.savedAnnotations.sort((a, b) => a.pageNumber - b.pageNumber);
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
          this.pdfService.scrollPageIntoView(1);
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

  public scrollToElement(editor: any): void {
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
      //this.commentDetails = null;
      const pdfViewerElement = this.elementRef.nativeElement.querySelector(
        'ngx-extended-pdf-viewer'
      );
      pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    }
  }

  public commntDropdownVisible(element: HTMLElement, editor: any): void {
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

  public annotationDeleted(event: AnnotationDeleteEvent) {
    this.utilService.removeAnnotation(event.id);
  }

  public submitComment(editor: any): void {
    editor.annotationConfig.comment = editor.tempComment;
    editor.showEdit = false;
  }

  public editComment(editor: any): void {
    this.commentList.forEach((c) => (c.showEdit = false));
    editor.tempComment = editor.annotationConfig.comment;
    editor.showEdit = true;
  }

  public removeAnnotation(editor: any) {
    editor.remove(editor);
  }


  public tagPublicVisibility(index:number): void {
    this.publicListVisible[index] = !this.publicListVisible[index];
  }

  tagPrivateVisibility(index: number): void {
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
    this.closeCommentPopover;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    //pdfViewerElement.removeEventListener('keydown', this.onKeyDown);
    this.subscription?.unsubscribe();
  }
}
