import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../util.service';
import { Comment } from '../util.service';

@Component({
  selector: 'app-comment-popover',
  templateUrl: './comment-popover.component.html',
  styleUrls: ['./comment-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CommentPopoverComponent {
  @Output() submitComment = new EventEmitter<string>();
  public newComment: string = '';
  public commentList: Comment[] = [];
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
        let comment: Comment = {
          text: selectedText,
          comment: this.newComment,
          id: '',
          spanLocations: [],
          editMode: false,
          isHovered: false,
        };
        this.utilService.updateComments(comment);
        this.newComment = '';
        console.log(this.commentList);
      }
      this.closeComment();
    }
  }
}
