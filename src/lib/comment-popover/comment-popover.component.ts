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
import '@fortawesome/fontawesome-free/css/all.min.css';

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

  public handleKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'Enter') {
      this.onSubmit();
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeComment();
    }
  }
}
