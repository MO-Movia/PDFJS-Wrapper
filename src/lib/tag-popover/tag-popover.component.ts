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

  constructor(public utilService: UtilService) {
    this.tagListPrivate = this.utilService.getTagListPrivate();
    this.tagListPublic = this.utilService.getTagListPublic();
  }
  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }

  public storeTag(): void {
    if (this.selectedTag) {
      const selectedTagText = document.querySelector(
        '.selectedEditor'
      ) as HTMLDivElement;
      const tagText = selectedTagText.ariaLabel;
      if (tagText != null) {
        if (this.selectedTag == 'Private') {
          console.log(tagText);
          this.utilService.updateTagListPrivate(tagText);
          console.log(this.tagListPrivate);
        } else {
          this.utilService.updateTagListPublic(tagText);
          console.log(this.tagListPublic);
        }
      }
      this.closeTag();
    }
  }
}
