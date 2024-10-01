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
});
