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
  public closePopover: boolean = false;

  constructor(public utilService: UtilService) {
    this.commentList = this.utilService.getCommentList();
  }

  public closeComment(): void {
    const popover = document.querySelector(
      '.comment-popover-content'
    ) as HTMLElement;
    if (!this.closePopover) {
      popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }

  public onSubmit(): void {
    this.closeComment();
    this.submitComment.emit();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + ' ' + value.substring(end);
      this.comment = newValue;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    } else if (event.key === 'Backspace') {
      const popover = document.querySelector(
        '.comment-popover-content'
      ) as HTMLElement;
      popover.style.display = 'block';
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const value = textarea.value;
        const newValue = value.substring(0, start) + value.substring(end);
        this.comment = newValue;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start;
        }, 0);
      } else if (start > 0) {
        const value = textarea.value;
        const newValue = value.substring(0, start - 1) + value.substring(end);
        this.comment = newValue;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
      }
    }
  }
}
