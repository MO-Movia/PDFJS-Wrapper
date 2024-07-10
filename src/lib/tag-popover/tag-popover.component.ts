import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../util.service';
import { MoPdfViewerComponent } from '../mo-pdf-viewer.component';


@Component({
  selector: 'mo-app-tag-popover',
  templateUrl: './tag-popover.component.html',
  styleUrls: ['./tag-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class TagPopoverComponent {
  @Input({ required: true }) public pdfSrc: string | Uint8Array = '';
  public closePopover: boolean = false;
  public selectedTag: string = '';
  public tagListPrivate: string[] = [];
  public tagListPublic: string[] = [];
  public selectedTagPublic: boolean = false;
  public selectedTagPrivate: boolean = false;

  @ViewChild(MoPdfViewerComponent)
  public pdfViewer!: MoPdfViewerComponent;

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
    if (this.selectedTagPublic || this.selectedTagPrivate) {
      const selectedTagText = document.querySelector(
        '.selectedEditor'
      ) as HTMLDivElement;
      const tagText = selectedTagText?.ariaLabel;

      if (tagText != null) {
        let highlightList = this.utilService.gethighlightText();
        const normalizedTagText = tagText.trim().toLowerCase();
        if (
          highlightList.some(
            (word) => word.trim().toLowerCase() === normalizedTagText
          )
        ) {
          highlightList = highlightList.filter(
            (word) => word.trim().toLowerCase() !== normalizedTagText
          );
          console.log('The updated highlightList is: ', highlightList);
          this.utilService.updatedHighlightList(highlightList);
        }

        if (this.selectedTagPrivate && this.selectedTagPublic) {
          this.utilService.updateTagListPrivate(tagText);
          this.utilService.updateTagListPublic(tagText);
        } else if (this.selectedTagPrivate) {
          this.utilService.updateTagListPrivate(tagText);
        } else if (this.selectedTagPublic) {
          this.utilService.updateTagListPublic(tagText);
        }
      }
      this.closeTag();
      this.utilService.submitTag();
    }
  }
}
