import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../util.service';

@Component({
  selector: 'mo-app-comment-popover',
  templateUrl: './comment-popover.component.html',
  styleUrls: ['./comment-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CommentPopoverComponent {
  @Output() public submitComment = new EventEmitter<string>();
  public comment: string = '';
  public commentList: any[];
  public isPopoverVisible: boolean = true;

  constructor(public utilService: UtilService) {
    this.commentList = this.utilService.getCommentList();
  }

  public togglePopover(): void {
    const popover = document.querySelector(
      '.comment-popover-content'
    ) as HTMLElement;
    popover.style.display = this.isPopoverVisible ? 'none' : 'block';
    this.isPopoverVisible = !this.isPopoverVisible;
  }

  public onSubmit(): void {
    if (this.comment.trim().length > 0) {
      this.togglePopover();
      this.submitComment.emit(this.comment);
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault();
      this.insertCharacter(textarea, ' ');
    } else if (event.key === 'Backspace') {
      this.showPopover();
      this.deleteCharacter(textarea);
    }
  }

  private insertCharacter(textarea: HTMLTextAreaElement, char: string): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.substring(0, start) + char + value.substring(end);
    this.comment = newValue;
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }, 0);
  }

  private deleteCharacter(textarea: HTMLTextAreaElement): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    if (start !== end) {
      this.comment = value.substring(0, start) + value.substring(end);
    } else if (start > 0) {
      this.comment = value.substring(0, start - 1) + value.substring(end);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      }, 0);
    }
  }

  private showPopover(): void {
    const popover = document.querySelector(
      '.comment-popover-content'
    ) as HTMLElement;
    popover.style.display = 'block';
  }
}
