import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPopoverComponent } from './tag-popover.component';

describe('CommentPopoverComponent', () => {
  let component: TagPopoverComponent;
  let fixture: ComponentFixture<TagPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle handleKeydown', () => {
    expect(component.handleKeydown({ key: 'Tab', preventDefault: () => {} } as unknown as KeyboardEvent,
      1)).toBeFalsy();
  });
  it('should handle handleKeydown when event.key === ArrowDown', () => {
    expect(component.handleKeydown({
      key: 'ArrowDown',
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as KeyboardEvent,
    1)).toBeFalsy();
  });
  it('should handle handleKeydown when event.key === ArrowUp', () => {
    expect(component.handleKeydown({
      key: 'ArrowUp',
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as KeyboardEvent,
    1)).toBeFalsy();
  });
  it('should handle closeTag', () => {
    spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
    component.closeTag();
    expect(component.closePopover).toBeTruthy();
  });
  it('should handle checkedTag', () => {
    component.editor = { annotationConfig: { Tags: [2] } };
    const spy = spyOn(component.tagSelected, 'emit');
    component.checkedTag({
      isChecked: false,
      isPrivate: true,
      id: 1,
      name: 'test',
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should handle tagSearch', () => {
    component.allTags = [
      { isChecked: false, isPrivate: true, id: 1, name: 'test' },
      { isChecked: false, isPrivate: true, id: 2, name: 'test' },
    ];
    expect(component.tagSearch('test')).toBeUndefined();
  });
  it('should handle tagSearch when value is null', () => {
    component.allTags = [
      { isChecked: false, isPrivate: true, id: 1, name: 'test' },
      { isChecked: false, isPrivate: true, id: 2, name: 'test' },
    ];
    component.tagSearch(null as unknown as string);
    expect(component.filteredTags).toEqual(component.allTags);
  });
  it('should handle storeTag', () => {
    const spy = spyOn(component.submitTag, 'emit');
    component.storeTag();
    expect(spy).toHaveBeenCalled();
  });
});
