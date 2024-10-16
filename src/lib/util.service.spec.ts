import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should handle annotationDataUpdated', () => {
    expect(service.annotationDataUpdated()).toBeFalsy();
  });
  it('should handle gethighlightText', () => {
    service.addEditor({ annotationConfig: { type: 'highlight' } });
    expect(service.gethighlightText()).toBeDefined();
  });
  it('should handle getCommentList', () => {
    service.addEditor({ annotationConfig: { type: 'highlight' } });
    expect(service.getCommentList()).toBeDefined();
  });
  it('should handle addEditor', () => {
    service.addEditor({
      annotationConfig: { type: 'highlight', Tags: [1, 2] },
    });
    const editor = {
      annotationConfig: { Tags: [{}] },
      _uiManager: { setSelected: (): void => {} },
    };
    const spy = spyOn(service, 'annotationDataUpdated');
    service.addEditor(editor);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle getEditor', () => {
    service.addEditor({
      annotationConfig: { type: 'highlight', Tags: [1, 2] },
      id: 'id',
    });
    expect(service.getEditor('id')).toEqual({
      annotationConfig: { type: 'highlight' , Tags: [ 1, 2 ]},
      id: 'id',
    });
  });
  it('should handle updateEditorType', () => {
    const spy = spyOn(service, 'annotationDataUpdated');
    service.addEditor({ annotationConfig: { type: 'highlight' }, id: 'id' });
    const editor = {
      id: 'id',
      annotationConfig: { Tags: [{}] },
      _uiManager: { setSelected: (): void => {} },
    };
    service.updateEditorType(editor);
    expect(spy).toHaveBeenCalled();
  });
  it('should handle removeAnnotation', () => {
    service.addEditor({
      annotationConfig: { type: 'highlight', Tags: [1, 2] },
    });
    const spy = spyOn(service, 'annotationDataUpdated');
    service.removeAnnotation('id');
    expect(spy).toHaveBeenCalled();
  });
  it('should handle getAnnotationConfigs', () => {
    service.addEditor({ annotationConfig: { type: 'highlight' }, id: 'id' });
    expect(service.getAnnotationConfigs()).toBeDefined();
  });
});
