// import { TestBed } from '@angular/core/testing';

// import { UtilService } from './util.service';

// describe('UtilService', () => {
//   let service: UtilService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(UtilService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should add a tag to tagListPrivate', () => {
//     const tag = 'newTag';
//     service.updateTagListPrivate(tag);
//     expect(service.tagListPrivate).toContain(tag);
//   });

//   it('should return the correct tag list', () => {
//     const initialTags = ['tag1', 'tag2', 'tag3'];
//     service.tagListPrivate = initialTags;
//     const result = service.getTagListPrivate();
//     expect(result).toEqual(initialTags);
//   });

//   it('should add a tag to tagListPublic', () => {
//     const tagToAdd = 'newTag';
//     service.updateTagListPublic(tagToAdd);
//     expect(service.tagListPublic).toContain(tagToAdd);
//   });

//   it('should return the correct tag list', () => {
//     const initialTags = ['tag1', 'tag2', 'tag3'];
//     service.tagListPublic = initialTags;
//     const result = service.getTagListPublic();
//     expect(result).toEqual(initialTags);
//   });

//   it('should return the correct highlight list', () => {
//     const initialHighlights = ['highlight1', 'highlight2', 'highlight3'];
//     service.highlightList = initialHighlights;
//     const result = service.gethighlightText();
//     expect(result).toEqual(initialHighlights);
//   });

//   it('should add a highlight to highlightList', () => {
//     const highlightToAdd = 'New highlight';
//     service.updateHighlightList(highlightToAdd);
//     expect(service.highlightList).toContain(highlightToAdd);
//   });

//   it('should update highlightList with new array', () => {
//     const newHighlights = ['highlight1', 'highlight2', 'highlight3'];
//     service.updatedHighlightList(newHighlights);
//     expect(service.highlightList).toEqual(newHighlights);
//   });

// });
