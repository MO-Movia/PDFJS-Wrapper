import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { UtilService } from '../util.service';
@Component({
  selector: 'app-tag-popover',
  templateUrl: './tag-popover.component.html',
  styleUrls: ['./tag-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class TagPopoverComponent {
  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;
  public closePopover: boolean = false;
  public selectedTag: string = '';
  public tagListPrivate: string[] = [];
  public tagListPublic: string[] = [];
  selectedTagPublic: boolean = false;
  selectedTagPrivate: boolean = false;
  publicTagListCount: number = 0;
  privateTagListCount: number = 0;

  constructor(public utilService: UtilService) {
    this.tagListPrivate = this.utilService.getTagListPrivate();
    this.tagListPublic = this.utilService.getTagListPublic();
    this.publicTagListCount = this.tagListPublic.length;
    this.privateTagListCount = this.tagListPrivate.length;
  }
  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }

  public storeTag(): void {
    if (this.selectedTagPublic || this.selectedTagPrivate) {
      const selectedTagText = document.querySelector(
        '.selectedEditor'
      ) as HTMLDivElement;
      const tagText = selectedTagText?.ariaLabel;

      if (tagText != null) {
        if (this.selectedTagPrivate && this.selectedTagPublic) {
          this.utilService.updateTagListPrivate(tagText);
          this.utilService.updateTagListPublic(tagText);
        } else if (this.selectedTagPrivate) {
          this.utilService.updateTagListPrivate(tagText);
        } else if (this.selectedTagPublic) {
          this.utilService.updateTagListPublic(tagText);
        }
        this.updateTagCounts();
        console.log(`Private Tags: ${this.tagListPrivate}`);
        console.log(`Public Tags: ${this.tagListPublic}`);
        console.log(`Private Tag Count: ${this.privateTagListCount}`);
        console.log(`Public Tag Count: ${this.publicTagListCount}`);
      }
      this.closeTag();
    }
  }

  public updateTagCounts(): void {
    this.publicTagListCount = this.utilService.getTagListPublic().length;
    this.privateTagListCount = this.utilService.getTagListPrivate().length;
  }
}
