import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMessage,
  faHighlighter,
  faTag,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'mo-dynamic',
  templateUrl: './text-options.component.html',
  imports: [FontAwesomeModule],
})
export class TextOptionsComponent {
  @Output() public highlightClicked = new EventEmitter<void>();
  @Output() public tagClicked = new EventEmitter<void>();
  @Output() public privateTagClicked = new EventEmitter<void>();
  @Output() public commentClicked = new EventEmitter<void>();
  @Output() public removeRequested = new EventEmitter<void>();
  public selectedText: string = '';

  public vcr: ViewContainerRef = inject(ViewContainerRef);
  public I = {
    faHighlighter,
    faMessage,
    faTag,
    faUserTag,
  };

  @HostListener('window:mouseup')
  public onMouseUp(): void {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      this.selectedText = selectedText;
    }
  }

  public onHighlightClicked(): void {
    this.highlightClicked.emit();
    this.removeRequested.emit();
  }

  public onTagClicked(): void {
    this.tagClicked.emit();
    this.removeRequested.emit();
  }

  public onPrivateTagClicked(): void {
    this.privateTagClicked.emit();
    this.removeRequested.emit();
  }

  public onCommentClicked(): void {
    this.commentClicked.emit();
    this.removeRequested.emit();
  }
}
