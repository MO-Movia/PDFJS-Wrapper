import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../util.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'mo-app-comment-popover',
  templateUrl: './comment-popover.component.html',
  styleUrls: ['./comment-popover.component.scss'],
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
})
export class CommentPopoverComponent implements AfterViewInit {
  @ViewChild('commentInput') public commentInput!: ElementRef;

  @Output() public submitComment = new EventEmitter<string>();
  public I = {
    faTimes,
  };
  public comment: string = '';
  public closePopover: boolean = false;

  constructor(public utilService: UtilService) {}

  public ngAfterViewInit(): void {
    this.commentInput.nativeElement.focus();
  }

  public closeComment(): void {
    const popover = document.querySelector('.comment-popover-content') as HTMLElement;
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
