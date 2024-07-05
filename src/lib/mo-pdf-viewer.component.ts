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
import { UtilService } from './util.service';
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
  public tagListPublic: string[] = [];
  public tagListPrivate: string[] = [];
  public commentList: Comment[] = [];
  public isOpenTag: boolean = false;
  public isOpenComment: boolean = false;
  public publicListVisible: boolean = false;
  public privateListVisible: boolean = false;
  public isHovered: boolean = false;
  highlightText: string | undefined;
  highlightTextArray: string[] = [];
  commentTextArray: string[] = [];
  textType: string | undefined;

  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;

  public ngOnInit(): void {
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.NodeObjectArray();
  }
  private popoverRef: any;
  private commentDetails: CommentTagEvent | null = null;
  private tagDetails: CommentTagEvent | null = null;
  private previousScrollTop = 0;
  private previousScrollLeft = 0;
  public highlightList: null[] = [];
  public dropdownVisible: any = {};
  public hoveredList: 'private' | 'public' | null | 'highlight' = null;
  public hoveredIndex: number | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public utilService: UtilService,
    public renderer: Renderer2
  ) {
    this.highlightList = utilService.gethighlightText();
    this.tagListPublic = utilService.getTagListPublic();
    this.tagListPrivate = utilService.getTagListPrivate();
    this.commentList = utilService.getCommentList();
  }

  public NodeObjectArray(): void {
    const pdfObject = {
      tagListPrivate: this.utilService.getTagListPrivate(),
      tagListPublic: this.utilService.getTagListPublic(),
      commentList: this.utilService.getCommentList(),
      highlightList: this.highlightTextArray,
    };
    console.log(pdfObject);
    type objType = {
      objId: number;
      objValue: unknown;
    };
    let objArray: Array<objType> = [{ objId: 1, objValue: pdfObject }];
    console.log(objArray[0].objId);
    console.log(objArray[0].objValue);
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
      data.highlightedText.parent.editors.values()
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
        if (!this.highlightTextArray.includes(this.highlightText)) {
          this.highlightTextArray.push(this.highlightText);
        }
      } else if (this.textType === 'Comment') {
        if (!this.commentTextArray.includes(this.highlightText)) {
          this.commentTextArray.push(this.highlightText);
        }
      }
    }
    this.highlightTextArray = this.highlightTextArray.filter((text) =>
      currentEditorValues.some((editor) => editor.text === text)
    );
    console.log('highlight array', this.highlightTextArray);
  }

  public commentTagPopover(data: ShowCommentTagPopoverDetails): void {
    console.log('commentTagPopover called with data:', data);
    if (data.detail.type === 'Comment') {
      this.showCommentPopover(data.detail);
    } else if (data.detail.type === 'Tag') {
      this.showTagPopover(data.detail);
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
      tagValue.appendChild(popoverElement);
    }
    // tagDetails.parent.parentNode.parentElement.appendChild(popoverElement);
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
      commentValue.appendChild(popoverElement);
    }
    this.commentDetails = commentDetails;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    this.renderer.listen('document', 'click', this.onDocumentClickComment);
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
    comment: CommentSelection,
    submitButton: HTMLButtonElement
  ): void {
    const textAreaValue = comment.comment && comment.comment.trim().length > 0;
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
    comment: CommentSelection,
    submitButton: HTMLButtonElement
  ): void {
    console.log(this.commentList);
    comment.editMode = false;
    submitButton.setAttribute('disabled', 'true');
  }

  public editComment(comment: CommentSelection): void {
    comment.editMode = true;
  }

  public removeComment(comment: Comment): void {
    const index = this.commentList.findIndex(
      (c) => c.comment === comment.comment
    );
    if (index > -1) {
      this.commentList.splice(index, 1);
    }
  }

  public removeTag(type: 'public' | 'private', index: number): void {
    if (type === 'public') {
      this.tagListPublic.splice(index, 1);
    } else if (type === 'private') {
      this.tagListPrivate.splice(index, 1);
    }
  }

  public closeCommentTextarea(comment: CommentSelection): void {
    comment.editMode = false;
  }

  public tagPublicVisibility(): void {
    this.publicListVisible = !this.publicListVisible;
  }

  public tagPrivateVisibility(): void {
    this.privateListVisible = !this.privateListVisible;
  }

  public showMenu(comment: Comment): void {
    comment.isHovered = true;
  }

  public hideMenu(comment: Comment): void {
    comment.isHovered = false;
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
  }
}
