import {
  Component,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ElementRef,
  OnDestroy,
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
export class MoPdfViewerComponent implements OnDestroy {
  @Input({ required: true }) public pdfSrc: string | Uint8Array = '';
  @Input() public documentTitle = '';
  @Input() public documentClassification = 'Unclassified';
  @Input() public documentAuthor = '';
  @Input() public minimalView = false;
  public tagListPublic: string[] = [];
  public tagListPrivate: string[] = [];
  public commentList: Comment[] = [];
  publicListVisible: boolean = false;
  privateListVisible: boolean = false;

  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;

  @ViewChild(TagPopoverComponent) tagPopoverComponent!: TagPopoverComponent;

  ngOnInit() {
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
  }

  private popoverRef: any;
  private commentDetails: CommentTagEvent | null = null;
  private tagDetails: CommentTagEvent | null = null;
  private previousScrollTop = 0;
  private previousScrollLeft = 0;
  private highlightList: Highlight[] = [];
  dropdownVisible: any = {};

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public utilService: UtilService
  ) {
    this.highlightList = utilService.gethighlightText();
    this.tagListPublic = utilService.getTagListPublic();
    this.tagListPrivate = utilService.getTagListPrivate();
    this.commentList = utilService.getCommentList();
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

  public commentTagPopover(data: ShowCommentTagPopoverDetails) {
    if (data.detail.type === 'Comment') {
      this.showCommentPopover(data.detail);
    } else if (data.detail.type === 'Tag') {
      this.showTagPopover(data.detail);
    }
  }

  public showTagPopover(tagDetails: CommentTagEvent) {
    if (this.popoverRef) {
      this.closeCommentPopover();
    }
    const popoverFactory =
      this.resolver.resolveComponentFactory(TagPopoverComponent);
    this.popoverRef = popoverFactory.create(this.injector);
    this.appRef.attachView(this.popoverRef.hostView);
    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;
    popoverElement.style.display = 'block';
    tagDetails.parent.parentNode.parentElement.appendChild(popoverElement);
    this.tagDetails = tagDetails;
    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
    // setTimeout(() => {
    //   document.addEventListener('click', this.onDocumentClick);
    // }, 0);
  }

  private showCommentPopover(commentDetails: CommentTagEvent) {
    if (this.popoverRef) {
      this.closeCommentPopover();
    }

    const popoverFactory = this.resolver.resolveComponentFactory(
      CommentPopoverComponent
    );
    this.popoverRef = popoverFactory.create(this.injector);
    this.popoverRef.instance.commentText = 'This is a comment';

    this.appRef.attachView(this.popoverRef.hostView);

    const popoverElement = (this.popoverRef.hostView as any)
      .rootNodes[0] as HTMLElement;

    popoverElement.style.display = 'block';

    commentDetails.parent.parentNode.parentElement.appendChild(popoverElement);

    this.commentDetails = commentDetails;

    const pdfViewerElement = this.elementRef.nativeElement.querySelector(
      'ngx-extended-pdf-viewer'
    );
    pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);

    pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
  }

  private onPdfViewerScroll = () => {
    if (this.popoverRef && this.commentDetails && this.tagDetails) {
      const pdfViewerElement = this.elementRef.nativeElement.querySelector(
        'ngx-extended-pdf-viewer'
      );
      this.previousScrollTop = pdfViewerElement.scrollTop;
      this.previousScrollLeft = pdfViewerElement.scrollLeft;
    }
  };

  private closeCommentPopover() {
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
        const hideDropdown = (event: MouseEvent) => {
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

  removeTag(type: 'public' | 'private', index: number) {
    if (type === 'public') {
      this.tagListPublic.splice(index, 1);
    } else if (type === 'private') {
      this.tagListPrivate.splice(index, 1);
    }
  }

  public closeCommentTextarea(comment: CommentSelection) {
    comment.editMode = false;
  }

  public tagPublicVisibility(): void {
    this.publicListVisible = !this.publicListVisible;
  }

  public tagPrivateVisibility(): void {
    this.privateListVisible = !this.privateListVisible;
  }

  ngOnDestroy() {
    this.closeCommentPopover;
  }
}
