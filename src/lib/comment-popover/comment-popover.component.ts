import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-popover',
  templateUrl: './comment-popover.component.html',
  styleUrls: ['./comment-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CommentPopoverComponent {
  @Input() commentText: string = ''; // Existing input for initial comment
  newComment = ''; // Property to store user input
  @Output() submitComment = new EventEmitter<string>();

  onSubmit() {
    this.submitComment.emit(this.newComment);
    this.newComment = '';
  }
}
