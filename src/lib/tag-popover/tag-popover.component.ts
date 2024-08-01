import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../util.service';
import { MoPdfViewerComponent } from '../mo-pdf-viewer.component';
import { CommonModule } from '@angular/common';
import { TagModel } from '../util.service';
@Component({
  selector: 'mo-app-tag-popover',
  templateUrl: './tag-popover.component.html',
  styleUrls: ['./tag-popover.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TagPopoverComponent {
  public editorId: string | undefined;
  public closePopover: boolean = false;
  public selectedTag: string = '';
  public tagData: any = {};
  public tagListPrivate: { id: number; name: string; isPrivate: boolean }[];
  public tagListPublic: { id: number; name: string; isPrivate: boolean }[];
  @Output() public submitTag = new EventEmitter<string>();
  @Output() public tagSelected = new EventEmitter<TagModel>();

  @ViewChild(MoPdfViewerComponent)
  public pdfViewer!: MoPdfViewerComponent;

  constructor(public utilService: UtilService) {
    this.tagListPrivate = this.utilService.getTags().filter((d) => d.isPrivate);
    this.tagListPublic = this.utilService.getTags().filter((d) => !d.isPrivate);
  }

  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }
  checkedTag(tagData: TagModel) {
    const currentTags = this.utilService._selectedTags.value;
    tagData.editorId = this.editorId;
    if (currentTags.length) {
      currentTags.forEach((tag) => {
        const tagIndex = currentTags.findIndex(
          (tag) => tagData.editorId === tag.editorId && tag.id === tagData.id
        );
        if (tagIndex !== -1) {
          const currentTagsfilter = currentTags.filter(
            (tag) => currentTags.indexOf(tag) !== tagIndex
          );
          this.utilService.updateSelectedTags(currentTagsfilter);
        } else {
          const updatedTags = [...currentTags, tagData];
          this.utilService.updateSelectedTags(updatedTags);
        }
      });
    } else {
      const updatedTags = [tagData];
      this.utilService.updateSelectedTags(updatedTags);
    }
    this.tagSelected.emit();
  }

  public storeTag(): void {
    this.closeTag();
    this.submitTag.emit(this.selectedTag);
  }
}
