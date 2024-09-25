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
  @Input() public savedAnnotations: AnnotationItem[] = [];
  @Output() public annotationUpdated = new EventEmitter<AnnotationItem[]>();
  public tagListPublic: TagListModel[] = [];
  public tagListPrivate: TagListModel[] = [];
  public commentList: highlightEditor[] = [];
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean[] = [];
  public privateListVisible: boolean[] = [];

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

    this.utilService.annotationUpdated$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.createPDFObject();
        this.annotationUpdated.emit(this.utilService.getAnnotationConfigs());
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

  public showHighlightedArray(editor: highlightEditor): void {
    this.utilService.addEditor(editor);
  }

  captureVisibleArea() {
    // Query all canvas elements inside the pdfViewer class
    const canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll(
      '.pdfViewer .page canvas'
    );

    if (!canvases.length) {
      console.error('No canvases found in the PDF viewer.');
      return;
    }

    // Convert the NodeList into an array for easier manipulation
    const canvasArray: HTMLCanvasElement[] = Array.from(canvases);

    // Create a new canvas to store the combined visible portions
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    if (!combinedCtx) {
      console.error('Failed to create 2D context on the new canvas.');
      return;
    }

    let totalHeight = 0; // To track the total height for the combined canvas
    let maxWidth = 0; // To track the maximum width
    let visiblePortions: {
      canvas: HTMLCanvasElement;
      visibleStartY: number;
      visibleHeight: number;
    }[] = [];

    // First, calculate the total height and maximum width of the visible areas
    for (const canvas of canvasArray) {
      const rect = canvas.getBoundingClientRect();
      // Check if the canvas is within the visible viewport
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        // Handle the case where only part of the canvas is visible at the top
        const visibleStartY = Math.max(0, window.scrollY - rect.top); // Only capture the visible part

        // Calculate the visible height correctly
        let visibleHeight: number;
        if (rect.top < 0) {
          // Top part of canvas is out of view
          visibleHeight = rect.height + rect.top; //Math.min(rect.height, window.innerHeight + rect.top);
        } else if (rect.bottom > window.innerHeight) {
          // Bottom part of canvas is out of view
          visibleHeight =window.innerHeight - rect.top; //rect.height - rect.top; //Math.min(rect.height, window.innerHeight - rect.bottom);
        } else {
          // Fully visible canvas
          visibleHeight = rect.height;
        }

        visiblePortions.push({ canvas, visibleStartY, visibleHeight }); // Store the visible portion for later use

        totalHeight += visibleHeight; // Accumulate the height of visible areas
        maxWidth = Math.max(maxWidth, canvas.width); // Track max width
      }
    }

    // Set the size of the combined canvas
    combinedCanvas.width = maxWidth;
    combinedCanvas.height = totalHeight;

    // Variable to track the current Y position while drawing
    let currentY = 0;

    // Now, draw each visible portion onto the combined canvas
    for (const { canvas, visibleStartY, visibleHeight } of visiblePortions) {
      combinedCtx.drawImage(
        canvas,
        0,
        visibleStartY, // Source X, Y on the original canvas
        canvas.width,
        visibleHeight, // Source width, height on the original canvas
        0,
        currentY, // Destination X, Y on the combined canvas
        canvas.width,
        visibleHeight // Destination width, height
      );

      // Update the current Y position for the next canvas portion
      currentY += visibleHeight;
    }

    // Convert the combined canvas area into a JPEG image
    const compressedJPEG = combinedCanvas.toDataURL('image/jpeg', 0.7);
    console.log('Captured visible area as JPEG:', compressedJPEG);

    // Find the target div where the captured image will be displayed
    const displayDiv = document.getElementById('pdf-visible-area');

    if (!displayDiv) {
      console.error('Target div to display the captured area was not found.');
      return;
    }

    // Clear the div before appending new content (if you want to overwrite old captures)
    displayDiv.innerHTML = '';

    // Create an image element and set its source to the compressed JPEG
    const img = document.createElement('img');
    img.src = compressedJPEG;
    img.alt = 'Captured visible area';

    // Append the image to the target div
    displayDiv.appendChild(img);
  }
  public commentTagPopover(data: ShowCommentTagPopoverDetails): void {
    const editor = this.utilService.getEditor(data.id);
    if (data.type === AnnotationActionType.comment) {
      this.showCommentPopover(editor);

      const commentPopoverInstance = this.popoverRef
        ?.instance as CommentPopoverComponent;
      commentPopoverInstance.comment = editor.annotationConfig.comment;
      commentPopoverInstance.submitComment
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
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
      tagPopoverInstance.tagSelected
        .pipe(takeUntilDestroyed())
        .subscribe((activeEditor) => {
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
