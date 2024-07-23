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
  public closePopover: boolean = false;

  constructor(public utilService: UtilService) {}

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
}
