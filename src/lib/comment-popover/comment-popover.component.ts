import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnnotationSelection, UtilService } from '../util.service';
import { Comment } from '../util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mo-app-comment-popover',
  templateUrl: './comment-popover.component.html',
  styleUrls: ['./comment-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CommentPopoverComponent {
  @Output() public submitComment = new EventEmitter<string>();
  public newComment: string = '';
  public commentList: AnnotationSelection;
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
    if (this.newComment) {
      const selectedTagText = document.querySelector(
        '.selectedEditor'
      ) as HTMLDivElement;
      const selectedText = selectedTagText.ariaLabel;

      if (selectedText != null) {
        let highlightList = this.utilService.gethighlightText();
        const normalizedTagText = selectedText.trim().toLowerCase();
        if (
          highlightList.text.some(
            (word) => word.trim().toLowerCase() === normalizedTagText
          )
        ) {
          highlightList.text = highlightList.text.filter(
            (word) => word.trim().toLowerCase() !== normalizedTagText
          );
          console.log('The updated highlightList is: ', highlightList);
          this.utilService.updatedHighlightList(highlightList);
        }
        let comment: Comment = {
          text: selectedText,
          comment: this.newComment,
          id: '',
          spanLocations: [],
          editMode: false,
          isHovered: false
        };
        this.utilService.updateComments(comment.comment);
        this.newComment = '';
        console.log(this.commentList);
      }
      this.closeComment();
       this.utilService.submitComment();
    }
  }
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + ' ' + value.substring(end);
      this.newComment = newValue;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
    // else if (event.key === 'Backspace') {
    //   const popover = document.querySelector(
    //     '.comment-popover-content'
    //   ) as HTMLElement;
    //   popover.style.display='block';
    //   const textarea = event.target as HTMLTextAreaElement;
    //   const start = textarea.selectionStart;
    //   const end = textarea.selectionEnd;

    //   // If there's a selection, remove the selected text
    //   if (start !== end) {
    //     const value = textarea.value;
    //     const newValue = value.substring(0, start) + value.substring(end);
    //     this.newComment = newValue;
    //     setTimeout(() => {
    //       textarea.selectionStart = textarea.selectionEnd = start;
    //     }, 0);
    //   } else if (start > 0) { // If no selection, remove the character before the cursor
    //     const value = textarea.value;
    //     const newValue = value.substring(0, start - 1) + value.substring(end);
    //     this.newComment = newValue;
    //     setTimeout(() => {
    //       textarea.selectionStart = textarea.selectionEnd = start - 1;
    //     }, 0);
    //   }
    // }
  }


}
