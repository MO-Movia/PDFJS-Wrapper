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
import { NgbNavModule, NgbTooltipModule, NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxExtendedPdfViewerModule,NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import {
  CommentTagEvent,
  ShowCommentTagPopoverDetails,
} from 'ngx-extended-pdf-viewer/lib/events/annotation-editor-layer-event';
import { CommentPopoverComponent } from './comment-popover/comment-popover.component';
import { TagPopoverComponent } from './tag-popover/tag-popover.component';

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
  ],
  providers: [provideAnimations()],
  selector: 'mo-pdf-viewer',
  templateUrl: './mo-pdf-viewer.component.html',
  styleUrls: ['./mo-pdf-viewer.component.scss'],
})
export class MoPdfViewerComponent {
  @Input({ required: true }) public pdfSrc: string | Uint8Array = '';
  @Input() public documentTitle = '';
  @Input() public documentClassification = 'Unclassified';
  @Input() public documentAuthor = '';
  @Input() public minimalView = false;

  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;

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

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private elementRef: ElementRef
  ) {}

  public commentTagPopover(data: ShowCommentTagPopoverDetails) {
    if (data.detail.type === 'Comment') {
      this.showCommentPopover(data.detail);
    }
    else if (data.detail.type === 'Tag') {
      this.showTagPopover(data.detail);
    }
  }

  public showTagPopover(tagDetails: CommentTagEvent){
    if (this.popoverRef) {
      this.closeTagCommentPopover();
    }
    const popoverFactory = this.resolver.resolveComponentFactory(
      TagPopoverComponent
    );
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
    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
    }, 0);
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
    
    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
    }, 0);
  }

  private onDocumentClick = (event: MouseEvent) => {
    if (this.popoverRef) {
      const popoverElement = (this.popoverRef.hostView as any).rootNodes[0] as HTMLElement;
      if (!popoverElement.contains(event.target as Node)) {
        this.closeTagCommentPopover();
      }
    }
  };

  private closeTagCommentPopover(){
    if (this.popoverRef) {
      this.appRef.detachView(this.popoverRef.hostView);
      this.popoverRef.destroy();
      this.popoverRef = null;
      document.removeEventListener('click', this.onDocumentClick);
    }
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

  ngOnDestroy() {
    this.closeCommentPopover;
  }
}
