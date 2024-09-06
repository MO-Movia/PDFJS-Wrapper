import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPopoverComponent } from './comment-popover.component';

describe('CommentPopoverComponent', () => {
  let component: CommentPopoverComponent;
  let fixture: ComponentFixture<CommentPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle onSubmit', () => {
    const spy = spyOn(component.submitComment, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
  it('should handle handleKeydown when event.ctrlKey && event.key === Enter', () => {
    const spy = spyOn(component, 'onSubmit');
    component.handleKeydown({
      ctrlKey: true,
      key: 'Enter',
    } as unknown as KeyboardEvent);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle handleKeydown when event.key === Escape || event.key === Esc', () => {
    const spy = spyOn(component, 'closeComment');
    component.handleKeydown({
      ctrlKey: true,
      key: 'Esc',
    } as unknown as KeyboardEvent);
    expect(spy).toHaveBeenCalled();
  });
});
