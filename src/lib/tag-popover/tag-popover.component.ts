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
  public tagListPrivate: TagModel[] = [];
  public tagListPublic: TagModel[] = [];
  public filteredTags: TagModel[] = [];
  public filter: string = '';
  public currentTags: TagModel[] = [];

  public isPublic: boolean = false;

  @Output() public submitTag = new EventEmitter<string>();
  @Output() public tagSelected = new EventEmitter<TagModel>();
  public origTags: TagModel[] = [];

  public allTags = [...this.tagListPrivate, ...this.tagListPublic];

  @ViewChild(MoPdfViewerComponent)
  public pdfViewer!: MoPdfViewerComponent;

  constructor(public utilService: UtilService) {
    this.tagListPrivate = this.utilService.getTags().filter((d) => d.isPrivate);
    this.tagListPublic = this.utilService.getTags().filter((d) => !d.isPrivate);
    this.isPublic = this.tagListPublic.some((publicTag) =>
      this.filteredTags.some((filteredTag) => filteredTag.id === publicTag.id)
    );
  }

  ngOnInit() {
    this.allTags = [...this.tagListPrivate, ...this.tagListPublic];
    this.filteredTags = this.allTags;
    const selectedTagsForEditor = this.utilService._selectedTags.value.filter(
      (tag) => tag.editorId === this.editorId
    );

    this.filteredTags.forEach((filteredTag) => {
      const foundTag = selectedTagsForEditor.find(
        (tag) => tag.id === filteredTag.id
      );
      filteredTag.isChecked = foundTag ? foundTag.isChecked : false;
    });
   
  }
  // ngAfterViewInit() {
  //   const popoverContent = document.querySelector('.tag-popover') as HTMLElement;
  //   const checkboxes = popoverContent.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
  
  //   // const firstCheckedCheckbox = Array.from(checkboxes).findIndex((checkbox) => checkbox.checked);
  
  //   if (checkboxes[5]) {
  //     const checkboxOffsetTop = checkboxes[5].offsetTop;
  //     popoverContent.scrollTo({
  //       top: checkboxOffsetTop,
  //       behavior: 'smooth',
  //     });
  //   }
  // }
  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }
  checkedTag(tagData: TagModel) {
    this.currentTags = this.utilService._selectedTags.value;
    tagData.editorId = this.editorId;
    if (this.currentTags.length) {
      this.currentTags.forEach((tag) => {
        const tagIndex = this.currentTags.findIndex(
          (tag) => tagData.editorId === tag.editorId && tag.id === tagData.id
        );
        if (tagIndex !== -1) {
          const currentTagsfilter = this.currentTags.filter(
            (tag) => this.currentTags.indexOf(tag) !== tagIndex
          );
          this.utilService.updateSelectedTags(currentTagsfilter);
        } else {
          const updatedTags = [...this.currentTags, tagData];
          tagData.isChecked = true;
          this.utilService.updateSelectedTags(updatedTags);
        }
      });
    } else {
      tagData.isChecked = true;
      const updatedTags = [tagData];
      this.utilService.updateSelectedTags(updatedTags);
    }
    this.tagSelected.emit();
  }

  public storeTag(): void {
    this.closeTag();
    this.submitTag.emit(this.selectedTag);
  }
  public tagSearch(value: string) {
    if (value) {
      this.filteredTags = [];
      this.filteredTags = this.allTags
        .filter((d) => d.name?.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.filteredTags = this.allTags;
    }
  }
  public showSelectedTabs() {
    const selectedTag = document.getElementById(
      'selectedTags'
    ) as HTMLInputElement;
    if (selectedTag?.checked === true) {
      this.filteredTags = this.utilService._selectedTags.value.filter(
        (tag) => tag.editorId === this.editorId
      );
    } else {
      this.filteredTags = this.allTags;
      this.updateSelectedTagsFromStorage();
    }
  }
  public updateSelectedTagsFromStorage() {
    const selectedTagsForEditor = this.utilService._selectedTags.value.filter(
      (tag) => tag.editorId === this.editorId
    );

    this.filteredTags.forEach((filteredTag) => {
      const foundTag = selectedTagsForEditor.find(
        (tag) => tag.id === filteredTag.id
      );
      filteredTag.isChecked = foundTag ? foundTag.isChecked : false;
    });
  }
}
