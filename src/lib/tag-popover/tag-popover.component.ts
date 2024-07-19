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

@Component({
  selector: 'mo-app-tag-popover',
  templateUrl: './tag-popover.component.html',
  styleUrls: ['./tag-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class TagPopoverComponent {
  public closePopover: boolean = false;
  @Input() public selectedTag: string = '';
  public tagListPrivate: { name: string; isPrivate: boolean }[];
  public tagListPublic: { name: string; isPrivate: boolean }[];
  @Output() public submitTag = new EventEmitter<string>();

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

  public storeTag(): void {
    this.closeTag();
    this.submitTag.emit(this.selectedTag);
  }
}
