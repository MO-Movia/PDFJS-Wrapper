import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import { UtilService } from '../util.service';
import { Tag } from '../util.service';
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
  public tagList: Tag[] = [];

  constructor(public utilService: UtilService) {
    this.tagList = this.utilService.getTagList();
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
        console.log(tagText);
        let tag: Tag = { tagType: this.selectedTag, tagText: tagText };
        this.utilService.updateTagList(tag);
        console.log(this.tagList);
      }
      this.closeTag();
    }
  }
}
