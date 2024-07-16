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
  PdfHighlightEditorComponent,
  NgxExtendedPdfViewerService,
  PageRenderEvent,
} from 'ngx-extended-pdf-viewer';
import {
  CommentTagEvent,
  ShowCommentTagPopoverDetails,
  showhighlightedArrayEvent,
} from 'ngx-extended-pdf-viewer/lib/events/annotation-editor-layer-event';
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
import { AnnotationSelection, UtilService } from './util.service';
import { Highlight } from './util.service';

import { Comment } from './util.service';
import { CommentSelection } from './models/comment-selection.model';
import { FormsModule } from '@angular/forms';
import { SpanLocation } from './models/span-location.model';

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
  public tagListPublic: AnnotationSelection;
  public tagListPrivate: AnnotationSelection;
  public commentList: AnnotationSelection;
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean = false;
  public privateListVisible: boolean = false;
  public isHovered: boolean = false;
  public isEditable:boolean[] = [];
  public newComment:string ='';
  highlightText: string | undefined ='';
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
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('keydown', this.onKeyDown);
    this.createPDFObject();
  }
  private popoverRef: any;
  private commentDetails: CommentTagEvent | null = null;
  private tagDetails: CommentTagEvent | null = null;
  private previousScrollTop = 0;
  private previousScrollLeft = 0;
  public highlightList: AnnotationSelection
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
    this.highlightList = utilService.gethighlightText();
    this.tagListPublic = utilService.getTagListPublic();
    this.tagListPrivate = utilService.getTagListPrivate();
    this.commentList = utilService.getCommentList();
  }

  public onPageLoaded(event: any): void {
    console.log('Page Load', event);
  }

public createPDFObject(): void {
  const annotationArrays = {
    tagListPrivate: this.utilService.getTagListPrivate(),
    tagListPublic: this.utilService.getTagListPublic(),
    commentList: this.utilService.getCommentList(),
    highlightList: this.utilService.gethighlightText(),
  };
  console.log(annotationArrays);

  interface PdfNodeObjectsType {
    Id: number;
    annotationObjArray: AnnotationObj;
    spanIndex: any;
  }
  interface AnnotationObj {
    tagListPrivate: AnnotationSelection;
    tagListPublic: AnnotationSelection;
    commentList: AnnotationSelection;
    highlightList: AnnotationSelection;
  }

  let pdfNodeObjects: Array<PdfNodeObjectsType> = [
    {
      Id: 1,
      annotationObjArray: annotationArrays,
      spanIndex: ''
    },
  ];
  console.log(pdfNodeObjects[0].Id);
  console.log(pdfNodeObjects[0].annotationObjArray);
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

  public showHighlightedArray(data: showhighlightedArrayEvent) {
    console.log('data:', data);

    const currentEditorValues = Array.from(
      data.highlightedText._uiManager.allEditors.values()
    ) as { text: string }[];
    for (const [key, value] of data.highlightedText.parent.editors.entries()) {
      console.log('Editor key:', key);
    }
    if (data.highlightedText) {
      this.highlightText = data.highlightedText.text;
      this.textType = data.highlightedText.type;
    } else {
      this.highlightText = undefined;
      this.textType = undefined;
    }
    if (this.highlightText !== undefined && this.textType !== undefined) {
      if (this.textType === 'Highlight') {
        if (!this.highlightList.text.includes(this.highlightText)) {
          this.highlightList.text.push(this.highlightText);
        }
      }
    }

    this.highlightList.text = this.highlightList.text.filter((text) =>
      currentEditorValues.some((editor) => editor.text === text)

    );
  
    this.tagListPrivate.text = this.tagListPrivate.text.filter((text) =>
      currentEditorValues.some((editor) => editor.text === text)

    );
    this.tagListPublic.text = this.tagListPublic.text.filter((text) =>
      currentEditorValues.some((editor) => editor.text === text)
    );
    for (let i = this.commentList.comment.length - 1; i >= 0; i--) {
      const text = this.commentList.text[i];
      const hasMatchingEditor = currentEditorValues.some(editor => editor.text === text);
      if (!hasMatchingEditor) {
        this.commentList.comment.splice(i, 1);
        this.commentList.text.splice(i, 1); 
      }
    }  
  
  }

  @HostListener('keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      event.preventDefault(); 
      event.stopPropagation();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const value = textarea.value;
        const newValue = value.substring(0, start) + value.substring(end);
        this.newComment = newValue;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start;
        }, 0);
      } else if (start > 0) { 
        const value = textarea.value;
        const newValue = value.substring(0, start - 1) + value.substring(end);
        this.newComment = newValue;
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
    if (data.detail.type === 'Comment') {
      this.showCommentPopover(data.detail);
      
      const commentPopoverInstance = this.popoverRef.instance as CommentPopoverComponent;
      commentPopoverInstance.submitComment.subscribe(() => {
      this.submitSubscription = this.utilService.submitActionComment$.subscribe(
        () => {
          data.detail.updateParams(
            AnnotationEditorParamsType.HIGHLIGHT_COLOR,
            '#80EBFF'
          );
        }
      );
    });
    } else if (data.detail.type === 'Tag') {
      this.showTagPopover(data.detail);

      const tagPopoverInstance = this.popoverRef.instance as TagPopoverComponent;
      tagPopoverInstance.submitTag.subscribe(() => {
      this.submitSubscription = this.utilService.submitActionTag$.subscribe(
        () => {
          data.detail.updateParams(
            AnnotationEditorParamsType.HIGHLIGHT_COLOR,
            '#53FFBC'
          );
        }
      );
    });
    }
  }

  public showTagPopover(tagDetails: CommentTagEvent): void {
    console.log('showTagPopover called with tagDetails:', tagDetails);
    this.closeCommentPopover();
    this.isOpenTag = true;
    const popoverFactory =
      this.resolver.resolveComponentFactory(TagPopoverComponent);
    this.popoverRef = popoverFactory.create(this.injector);
    this.appRef.attachView(this.popoverRef.hostView);
    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;
    popoverElement.style.display = 'block';
    let tagValue = null;
    for (let [key, value] of tagDetails.parent.editors) {
      console.log(`Key: ${key}`);
      console.log('Value:', value);
      tagValue = value.div;
    }
    if (tagValue) {
      const selectedText = document.querySelector(
        '.highlightEditor.selectedEditor'
      ) as HTMLElement;
      selectedText.appendChild(popoverElement);
    }
    this.tagDetails = tagDetails;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickTag);
  }

  public showCommentPopover(commentDetails: CommentTagEvent): void {
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
    let commentValue = null;
    for (let [key, value] of commentDetails.parent.editors) {
      console.log(`Key: ${key}`);
      console.log('Value:', value);
      commentValue = value.div;
    }
    if (commentValue) {
      const selectedText = document.querySelector(
        '.highlightEditor.selectedEditor'
      ) as HTMLElement;
      selectedText.appendChild(popoverElement);
    }
    this.commentDetails = commentDetails;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickComment);
  }

  public onPageRendered(event: PageRenderEvent): void {

    //     this.pdfService.setAnnotation([{spanIndex: 42,
    //       rangeStart: 0,
    //       rangeEnd: 40,
    //       color: '#000'},
    //       {spanIndex: 44,
    //         rangeStart: 5,
    //         rangeEnd: 10,
    //         color: '#000'},
    //         {spanIndex: 48,
    //           rangeStart: 3,
    //           rangeEnd: 8,
    //           color: '#000'},
    // ]);
      
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

        if (this.isOpenTag) {
          popover.style.display = 'none';
        }
        this.isOpenTag = false;
      }
      if (clickedInsidePopover) {
        this.highlightList = this.utilService.gethighlightText();
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

        if (this.isOpenComment) {
          popover.style.display = 'none';
        }
        this.isOpenTag = false;
      }
      if (clickedInsidePopover) {
        this.highlightList = this.utilService.gethighlightText();
      }
    }
  };

  public scrollToHighlight(highlight: string): void {
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );

    if (pdfViewerElement && highlight) {
      const textElements =
        pdfViewerElement.querySelectorAll('.highlightEditor');
      if (textElements.length === 0) {
        return;
      }
      let foundElement: HTMLElement | null = null;
      textElements.forEach((element: HTMLElement) => {
        if (element.ariaLabel === highlight) {
          foundElement = element;
        }
      });

      if (foundElement) {
        (foundElement as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } 
    }
  }
  public scrollToTag(tag:string){
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );

    if (pdfViewerElement && tag) {
      const textElements =
        pdfViewerElement.querySelectorAll('.highlightEditor');
      if (textElements.length === 0) {
        return;
      }
      let foundElement: HTMLElement | null = null;
      textElements.forEach((element: HTMLElement) => {
        if (element.ariaLabel === tag) {
          foundElement = element;
        }
      });

      if (foundElement) {
        (foundElement as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } 
    }
  }
  public scrollToComment(text:string){
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );

    if (pdfViewerElement && text) {
      const textElements =
        pdfViewerElement.querySelectorAll('.highlightEditor');
      if (textElements.length === 0) {
        return;
      }
      let foundElement: HTMLElement | null = null;
      textElements.forEach((element: HTMLElement) => {
        if (element.ariaLabel === text) {
          foundElement = element;
        }
      });

      if (foundElement) {
        (foundElement as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } 
    }
  }

  public onPdfViewerScroll = (): void => {
    if (this.popoverRef && this.commentDetails && this.tagDetails) {
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
      this.commentDetails = null;
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

  public submitComment(
    index: number,
    submitButton: HTMLButtonElement
  ): void {
    if (this.newComment.trim()) {
      this.commentList.comment[index] = this.newComment; 
      this.newComment = ''; 
    }
    this.isEditable[index] = false;
    submitButton.setAttribute('disabled', 'true');
  }

  public editComment(index:number): void {
  this.newComment = this.commentList.comment[index]
   this.isEditable[index] = true;
   
  }

  public removeComment(index:number): void {
    this.commentList.comment.splice(index,1);
    this.commentList.text.splice(index,1);
  }
  // public removeHighlight(index: number): void {
  //   const pdfViewerElement = this.elementRef.nativeElement.querySelector(
  //     'ngx-extended-pdf-viewer'
  //   );
  
  //   if (pdfViewerElement && this.highlightList.text[index]) {
  //     const textElements = pdfViewerElement.querySelectorAll('.highlightEditor');
  //     if (textElements.length === 0) {
  //       return;
  //     }

  
  //     let foundElement: any = null;
  //     textElements.forEach((element: HTMLElement) => {
  //       if (element.ariaLabel === this.highlightList.text[index]) {
  //         foundElement = element;
  //       }
  //     });
  //     if (foundElement && foundElement.setSelectionRange) {
  //       // Modern browsers
  //       foundElement.focus();
  //          foundElement.click();
  //          foundElement.click();
  //   }
      

  //       // const lastChild =foundElement.childNodes[1].childNodes[0].lastElementChild;
  //       //     if (lastChild) {
  //       //     lastChild.click();
  //       //     // secondChild.classList.add('hidden');
  //       //     }
  //         // Rem
    
  //       const secondChild = foundElement.querySelector(':nth-child(2)'); // Select second child element
  //       if (secondChild && secondChild.classList) {
  //         secondChild.classList.remove(secondChild.classList[1]); 
          
  //           const lastChild =foundElement.childNodes[1].childNodes[0].lastElementChild;
  //           if (lastChild) {
  //           lastChild.click();
  //           // secondChild.classList.add('hidden');
  //           }
  //         // Remove class at index 1
  //       }
  //       const lastChild =foundElement.childNodes[1].classList[1]
  //       if (lastChild) {
  //           lastChild.click();
  //         } 
         
  //      else {
  //       console.error('Element corresponding to highlightList[index] not found.');
  //     }
  //   } 
  
  //   this.highlightList.text.splice(index, 1);
    
  // }

  

  public removeTag(type: 'public' | 'private', index: number): void {
    if (type === 'public') {
      this.tagListPublic.comment.splice(index, 1);
    } else if (type === 'private') {
      this.tagListPrivate.text.splice(index, 1);
    }
  }

  public closeCommentTextarea(index:number,comment: string): void {
   this.isEditable[index]=false;
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
