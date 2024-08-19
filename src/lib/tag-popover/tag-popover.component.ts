import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit
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
export class TagPopoverComponent implements AfterViewInit {
  public editor: any = {};
  public closePopover: boolean = false;
  public selectedTag: string = '';
  public filteredTags: TagModel[] = [];
  public allTags: TagModel[] = [];
  private currentIndex: number = 0;

  @Output() public submitTag = new EventEmitter<string>();
  @Output() public tagSelected = new EventEmitter<any>();

  @ViewChild(MoPdfViewerComponent)
  public pdfViewer!: MoPdfViewerComponent;

  @ViewChildren('checkbox')
  private checkboxes!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(public utilService: UtilService) { }

  ngOnInit() {
    this.allTags = this.utilService.getTags();
    this.allTags.forEach((tag) => {
      tag.isChecked = this.editor.annotationConfig.Tags.includes(tag.id);
    });
    this.filteredTags = this.allTags;
  }

  ngAfterViewInit() {
    if (this.checkboxes.length > 0) {
      this.currentIndex = 0;
      this.checkboxes.toArray()[0].nativeElement.focus();
    }
  }

  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }

  checkedTag(tag: TagModel) {
    this.allTags.forEach((aTag) => {
      if (aTag.id === tag.id) {
        aTag.isChecked = tag.isChecked;
      }
    });

    if (tag.isChecked) {
      this.editor.annotationConfig.Tags.push(tag.id);
    } else {
      this.editor.annotationConfig.Tags =
        this.editor.annotationConfig.Tags.filter((t: number) => t !== tag.id);
    }
    this.tagSelected.emit(this.editor);
  }

  public storeTag(): void {
    this.closeTag();
    this.submitTag.emit(this.selectedTag);
  }

  public tagSearch(value: string) {
    if (value) {
      this.filteredTags = this.allTags
        .filter((d) => d.name?.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.filteredTags = this.allTags;
    }
  }

  public showSelectedTags(event: Event) {
    const selectedTag = event.target as HTMLInputElement;
    this.filteredTags = selectedTag.checked
      ? this.allTags.filter((tag) => tag.isChecked)
      : this.allTags;
  }

  handleKeydown(event: KeyboardEvent, index: number): void {
    const checkboxesArray = this.checkboxes.toArray();

    if (event.key === 'Tab') {
      event.preventDefault(); 
      this.toggleCheckbox(checkboxesArray[index], index);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); 
      event.stopPropagation();
      this.navigateCheckboxes(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this.navigateCheckboxes(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault(); 
      this.toggleCheckbox(checkboxesArray[index], index);
    }
  }

  private navigateCheckboxes(direction: number): void {
    const checkboxesArray = this.checkboxes.toArray();
    if (checkboxesArray.length === 0) return;

    this.currentIndex = (this.currentIndex + direction + checkboxesArray.length) % checkboxesArray.length;
    checkboxesArray[this.currentIndex].nativeElement.focus();
  }

  private toggleCheckbox(checkboxElement: ElementRef<HTMLInputElement>, index: number): void {
    const checkbox = checkboxElement.nativeElement;
    checkbox.checked = !checkbox.checked;
    this.checkedTag(this.filteredTags[index]);
  }
}
