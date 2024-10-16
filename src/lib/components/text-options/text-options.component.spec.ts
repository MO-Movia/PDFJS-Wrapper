import { TestBed } from '@angular/core/testing';
import { TextOptionsComponent } from './text-options.component';

describe('TextOptionsComponent', () => {
  let component: TextOptionsComponent;

  beforeEach(async () => {
    const fixture = TestBed.createComponent(TextOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle tag clicked', () => {
    spyOn(component.tagClicked, 'emit');
    spyOn(component.removeRequested, 'emit');

    component.onTagClicked();

    expect(component.tagClicked.emit).toHaveBeenCalled();
    expect(component.removeRequested.emit).toHaveBeenCalled();
  });

  it('should handle comment clicked', () => {
    spyOn(component.commentClicked, 'emit');
    spyOn(component.removeRequested, 'emit');

    component.onCommentClicked();

    expect(component.commentClicked.emit).toHaveBeenCalled();
    expect(component.removeRequested.emit).toHaveBeenCalled();
  });

  it('should handle highlight clicked', () => {
    spyOn(component.highlightClicked, 'emit');
    spyOn(component.removeRequested, 'emit');

    component.onHighlightClicked();

    expect(component.highlightClicked.emit).toHaveBeenCalled();
    expect(component.removeRequested.emit).toHaveBeenCalled();
  });

  it('should handle private tag clicked', () => {
    spyOn(component.privateTagClicked, 'emit');
    spyOn(component.removeRequested, 'emit');

    component.onPrivateTagClicked();

    expect(component.privateTagClicked.emit).toHaveBeenCalled();
    expect(component.removeRequested.emit).toHaveBeenCalled();
  });
  it('should handle onMouseUp', () => {
    const spy = spyOn(window, 'getSelection').and.returnValue({
      key: 'value',
    } as unknown as Selection);
    component.onMouseUp();
    expect(spy).toHaveBeenCalled();
  });
});
