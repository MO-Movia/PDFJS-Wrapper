import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoPdfViewerComponent } from './mo-pdf-viewer.component';
import { ComponentRef, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { DynamicComponent } from './components/text-options/text-options.component';
import { CommentSelection } from './models/comment-selection.model';
import { HighlightSelection } from './models/highlight.model';
import { SpanLocation } from './models/span-location.model';
import { TagSelection } from './models/tag-selection.model';

describe('MoPdfViewerComponent', () => {
  let component: MoPdfViewerComponent;
  let fixture: ComponentFixture<MoPdfViewerComponent>;
  let params!: { page?: number };

  beforeEach(() => {
    params = {};
    TestBed.configureTestingModule({
      declarations: [MoPdfViewerComponent],
      imports: [ FontAwesomeModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: params
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(MoPdfViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show options if composed path contains ref to dynamic component', () => {
    spyOn(window, 'getSelection');
    const mouseEvent = {
      composedPath: (): EventTarget[] => {
        return [] as EventTarget[];
      }
    };
    const element = {};
    component.componentRefs.push({
      location: {
        nativeElement: element
      }
    } as ComponentRef<DynamicComponent>);
    spyOn(mouseEvent, 'composedPath').and.returnValue([element as Element]);
    component.showOptions(mouseEvent as MouseEvent);
    expect(window.getSelection).toHaveBeenCalledTimes(0);
  });

  it('should show options', () => {
    const ref = component['viewContainerRef'];
    const compRef = {
      location: {
        nativeElement: {
          classList: new Set<string>(),
          style: {
            top: '',
            left: ''
          }
        }
      },
      instance: {
        highlightClicked: new EventEmitter<void>(),
        tagClicked: new EventEmitter<void>(),
        privateTagClicked: new EventEmitter<void>(),
        commentClicked: new EventEmitter<void>(),
        removeRequested: new EventEmitter<void>()
      }
    };
    spyOn(compRef.instance.commentClicked, 'subscribe');
    spyOn(compRef.instance.tagClicked, 'subscribe');
    spyOn(compRef.instance.privateTagClicked, 'subscribe');
    spyOn(compRef.instance.highlightClicked, 'subscribe');
    spyOn(compRef.instance.removeRequested, 'subscribe');
    spyOn(ref, 'createComponent').and.returnValue(compRef as ComponentRef<DynamicComponent>);
    spyOn(window, 'getSelection');
    const mouseEvent = {
      clientX: 5,
      clientY: 6,
      composedPath: (): EventTarget[] => {
        return [] as EventTarget[];
      },
      target: {
        parentElement: {
          parentElement: {
            insertAdjacentElement: (): void => {}
          },
          getBoundingClientRect: (): Record<string, number> => {
            return {
              left: 2,
              top: 1
            };
          }
        }
      } as unknown as EventTarget
    };
    component.showOptions(mouseEvent as MouseEvent);
    expect(compRef.location.nativeElement.style.left).toEqual('3px');
    expect(compRef.location.nativeElement.style.top).toEqual('5px');
    expect(compRef.instance.commentClicked.subscribe).toHaveBeenCalled();
    expect(compRef.instance.tagClicked.subscribe).toHaveBeenCalled();
    expect(compRef.instance.privateTagClicked.subscribe).toHaveBeenCalled();
    expect(compRef.instance.highlightClicked.subscribe).toHaveBeenCalled();
    expect(compRef.instance.removeRequested.subscribe).toHaveBeenCalled();
  });

  it('should set classes for highlight', (done) => {
    const testSelection = {
      toString: (): string => {
        return 'testText';
      }
    } as Selection;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem').and.callFake((
      item,
      list,
      htmlClass,
      selectionMap,
      selection
    ) => {
      const highlight = item as HighlightSelection;
      expect(highlight.text).toEqual('testText');
      expect(list).toBe(component.highlights);
      expect(htmlClass).toEqual('match-highlight');
      expect(selectionMap).toBe(component.spanHighlightsMap);
      expect(selection).toBe(testSelection);
      done();
    });
    component.setClassesForHighlights();
  });

  it('should set classes for highlight handle null selection', () => {
    const testSelection = null;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem');
    component.setClassesForHighlights();
    expect(component.setClassesForItem).toHaveBeenCalledTimes(0);
  });

  it('should set classes for comments', (done) => {
    const testSelection = {
      toString: (): string => {
        return 'testText';
      }
    } as Selection;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem').and.callFake((
      item,
      list,
      htmlClass,
      selectionMap,
      selection
    ) => {
      const comment = item as CommentSelection;
      expect(comment.text).toEqual('testText');
      expect(comment.comment).toEqual('');
      expect(list).toBe(component.comments);
      expect(htmlClass).toEqual('match-comment');
      expect(selectionMap).toBe(component.spanCommentsMap);
      expect(selection).toBe(testSelection);
      done();
    });
    component.setClassesForComments();
  });

  it('should set classes for comments handle null selection', () => {
    const testSelection = null;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem');
    component.setClassesForComments();
    expect(component.setClassesForItem).toHaveBeenCalledTimes(0);
  });

  it('should set classes for tags', (done) => {
    const testSelection = {
      toString: (): string => {
        return 'testText';
      }
    } as Selection;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem').and.callFake((
      item,
      list,
      htmlClass,
      selectionMap,
      selection
    ) => {
      const tag = item as TagSelection;
      expect(tag.text).toEqual('testText');
      expect(tag.tags).toEqual([]);
      expect(list).toBe(component.tags);
      expect(htmlClass).toEqual('match-tag');
      expect(selectionMap).toBe(component.spanTagMap);
      expect(selection).toBe(testSelection);
      done();
    });
    component.setClassesForTags();
  });

  it('should set classes for tags handle null selection', () => {
    const testSelection = null;
    spyOn(window, 'getSelection').and.returnValue(testSelection);
    spyOn(component, 'setClassesForItem');
    component.setClassesForTags();
    expect(component.setClassesForItem).toHaveBeenCalledTimes(0);
  });

  it('should search page after load', () => {
    params.page = 2;
    component.afterLoadComplete();
    expect(component.page).toEqual(2);
  });

  it('should handle null page after load', () => {
    component.afterLoadComplete();
    expect(component.page).toEqual(1);
  });

  it('should select search category', () => {
    component.selectSearchCategory('testCategory');
    expect(component.selectedSearchCategory).toEqual('testCategory');
  });

  it('should search text', () => {
    component.pdfComponent = {
      eventBus: {
        dispatch: () => {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    } as PdfViewerComponent;
    spyOn(component.pdfComponent.eventBus, 'dispatch');
    component.search('testSearch');
    expect(component.pdfComponent.eventBus.dispatch).toHaveBeenCalledWith('find',
      {
        query: 'testSearch',
        type: 'again',
        caseSensitive: false,
        findPrevious: undefined,
        highlightAll: true,
        phraseSearch: true
      });
  });

  it('should close source', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.closeSource();
    expect(router.navigate).toHaveBeenCalledWith(['sources']);
  });

  it('should delete all componentref', () => {
    const ref = {
      destroy: (): void => {}
    };
    component.componentRefs.push(ref as ComponentRef<DynamicComponent>);
    spyOn(ref, 'destroy');
    component.deleteAllComponentRef();
    expect(ref.destroy).toHaveBeenCalled();
    expect(component.componentRefs.length).toEqual(0);
  });

  it('should get first page from selection', () => {
    const pageNumber = component.getFirstPage({
      spanLocations: [
        {
          pageNumber: 2
        } as SpanLocation
      ]
    });
    expect(pageNumber).toEqual(2);
  });

  it('should handle first page from empty selection', () => {
    const pageNumber = component.getFirstPage({
      spanLocations: []
    });
    expect(pageNumber).toBeNull();
  });

  it('should get first span from selection', () => {
    const span = component.getFirstSpan({
      spanLocations: [
        {
          pageNumber: 2,
          spanIndex: 3
        }
      ]
    });
    expect(span).toEqual(3);
  });

  it('should handle first span from empty selection', () => {
    const span = component.getFirstSpan({
      spanLocations: []
    });
    expect(span).toBeNull();
  });

  it('should not get page parent if it does not exist', () => {
    const node = {};
    const res = component.getPageParent(node as Node);
    expect(res).toBeNull();
  });

  it('should get page parent', () => {
    const targetElement = {
      classList: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        contains: (arg: string): boolean => {
          return true;
        }
      },
      nodeName: 'DIV'
    };
    spyOn(targetElement.classList, 'contains').and.returnValue(true);
    const parentDivElement = {
      classList: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        contains: (arg: string): boolean => {
          return false;
        }
      },
      nodeName: 'DIV',
      parentElement: targetElement
    };
    spyOn(parentDivElement.classList, 'contains').and.returnValue(false);
    const parentSpanElement = {
      classList: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        contains: (arg: string): boolean => {
          return false;
        }
      },
      nodeName: 'SPAN',
      parentElement: parentDivElement
    };
    const node = {
      parentElement: parentSpanElement
    };
    const res = component.getPageParent(node as unknown as Node);
    expect(res).toBe(targetElement as unknown as HTMLElement);
    expect(parentDivElement.classList.contains).toHaveBeenCalledWith('page');
    expect(targetElement.classList.contains).toHaveBeenCalledWith('page');
  });

  it('should get span from text node', () => {
    const parentElement = {

    };
    const node = {
      nodeName: '#text',
      parentElement
    };
    const element = component.getSpan(node as Node);
    expect(element).toBe(parentElement as HTMLElement);
  });

  it('should get span from span node', () => {
    const node = {
      nodeName: 'SPAN'
    };
    const element = component.getSpan(node as Node);
    expect(element).toBe(element as HTMLElement);
  });

  it('should not get span from div node', () => {
    const node = {
      nodeName: 'DIV'
    };
    const element = component.getSpan(node as Node);
    expect(element).toBeNull();
  });

  it('should find range selections handle null', () => {
    const res = component.findRangeSections(null as unknown as Selection);
    expect(res).toEqual([]);
  });

  it('should find range selections', () => {
    const startContainer = {};
    const endContainer = {};
    const range = {
      cloneRange: (): void => {},
      startContainer,
      endContainer
    };
    range.cloneRange = (): unknown => {
      return range;
    };
    const selection = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getRangeAt: (index: number): unknown => {
        return range;
      },
      anchorOffset: 4,
      focusOffset:6
    };
    spyOn(component, 'getSpanLocation').and.callFake((container) => {
      if (container == startContainer) {
        return {
          pageNumber: 2,
          spanIndex: 4
        };
      } else {
        return {
          pageNumber: 5,
          spanIndex: 2
        };
      }
    });
    const interveningLocations: SpanLocation[] = [
      {
        pageNumber: 2,
        spanIndex: 4
      },
      {
        pageNumber: 3,
        spanIndex: 5
      },
      {
        pageNumber: 5,
        spanIndex: 2
      }
    ];
    spyOn(component, 'getInterveningLocations').and.returnValue(interveningLocations);
    const res = component.findRangeSections(selection as unknown as Selection);
    expect(res).toEqual(interveningLocations);
    expect(interveningLocations[0].startOffset).toEqual(4);
    expect(interveningLocations[2].endOffset).toEqual(6);
  });

  it('should remove highlight', () => {
    const targetHighlight = {
      id: 'testId',
      spanLocations: [],
      text: ''
    };
    component.highlights = [targetHighlight];
    spyOn(component, 'removeSelection');
    component.removeHighlight(targetHighlight);
    expect(component.removeSelection).toHaveBeenCalledWith(
      targetHighlight,
      'match-highlight',
      targetHighlight.id,
      component.spanHighlightsMap
    );
  });

  it('should remove comment', () => {
    const targetComment = {
      id: 'testId',
      spanLocations: [],
      text: '',
      comment: ''
    };
    component.comments = [targetComment];
    spyOn(component, 'removeSelection');
    component.removeComment(targetComment);
    expect(component.removeSelection).toHaveBeenCalledWith(
      targetComment,
      'match-comment',
      targetComment.id,
      component.spanCommentsMap
    );
  });

  it('should remove tag selection', () => {
    const targetTagSelection = {
      id: 'testId',
      spanLocations: [],
      text: '',
      tags: []
    };
    component.tags = [targetTagSelection];
    spyOn(component, 'removeSelection');
    component.removeTag(targetTagSelection);
    expect(component.removeSelection).toHaveBeenCalledWith(
      targetTagSelection,
      'match-tag',
      targetTagSelection.id,
      component.spanTagMap
    );
  });

  it('should go to selection', () => {
    const span = {
      scrollIntoView: (): void => {}
    } as Element;
    spyOn(span, 'scrollIntoView');
    spyOn(component, 'selectSelection');
    spyOn(component, 'getSpanFromLocation').and.returnValue(span);
    component.goToSelection({
      spanLocations: [{
        pageNumber: 4,
        spanIndex: 3
      }]
    });
    expect(span.scrollIntoView).toHaveBeenCalled();
  });

  it('should select selection', () => {
    const element = {
      classList: {
        remove: (): void => {}
      }
    } as Element;
    spyOn(element.classList, 'remove');
    spyOn(document, 'querySelectorAll').and.returnValue([ element ] as unknown as NodeListOf<Element>);
    const location = {
      pageNumber: 5,
      spanIndex: 6
    };
    spyOn(component, 'setSpanClassFromLocation');
    component.selectSelection({
      spanLocations: [ location ]
    });
    expect(element.classList.remove).toHaveBeenCalled();
    expect(component.setSpanClassFromLocation).toHaveBeenCalledWith(location, 'match-active');
  });

  it('should get text layer from location', () => {
    const secondElement = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      querySelector: (text: string): void => { }
    };
    const pdfComponent = {
      pdfViewerContainer: {
        nativeElement: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          querySelector: (text: string) => {
            return secondElement;
          }
        } as unknown as HTMLDivElement
      }
    } as PdfViewerComponent;
    component.pdfComponent = pdfComponent;
    spyOn(pdfComponent.pdfViewerContainer.nativeElement, 'querySelector').and.returnValue(secondElement as Element);
    spyOn(secondElement, 'querySelector');
    component.getTextLayerFromLocation(2);
    expect(pdfComponent.pdfViewerContainer.nativeElement.querySelector).toHaveBeenCalledWith('[data-page-number="2"]');
    expect(secondElement.querySelector).toHaveBeenCalledWith('div.textLayer');
  });

  it('should get middle pages', () => {
    const endPage = {
      nodeName: 'DIV',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass === 'page';
        }
      }
    } as unknown as HTMLElement;
    const nonPageDiv = {
      nextElementSibling: endPage,
      nodeName: 'DIV',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass !== 'page';
        }
      }
    } as unknown as HTMLElement;
    const br3 = {
      nextElementSibling: nonPageDiv,
      nodeName: 'BR',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass !== 'page';
        }
      }
    } as unknown as HTMLElement;
    const page2 = {
      nextElementSibling: br3,
      nodeName: 'DIV',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass === 'page';
        }
      }
    } as unknown as HTMLElement;
    const br2 = {
      nextElementSibling: page2,
      nodeName: 'BR',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass !== 'page';
        }
      }
    } as unknown as HTMLElement;
    const page1 = {
      nextElementSibling: br2,
      nodeName: 'DIV',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass === 'page';
        }
      }
    } as unknown as HTMLElement;
    const br1 = {
      nextElementSibling: page1,
      nodeName: 'BR',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass !== 'page';
        }
      }
    } as unknown as HTMLElement;
    const startPage = {
      nextElementSibling: br1,
      nodeName: 'DIV',
      classList: {
        contains: (htmlClass: string) => {
          return htmlClass === 'page';
        }
      }
    } as unknown as HTMLElement;
    const res = component.getMiddlePages(startPage, endPage);
    expect(res).toEqual([page1, page2]);
  });

  it('should get same page locations', () => {
    const startLocation: SpanLocation = {
      pageNumber: 5,
      spanIndex: 2
    };
    const location2: SpanLocation = {
      pageNumber: 5,
      spanIndex: 3
    };
    const location3: SpanLocation = {
      pageNumber: 5,
      spanIndex: 4
    };
    const endLocation: SpanLocation = {
      pageNumber: 5,
      spanIndex: 5
    };
    const loc = component.getSamePageLocations(startLocation, endLocation);
    expect(loc).toEqual([startLocation, location2, location3, endLocation]);
  });

  it('should get end page locations', () => {
    const location1: SpanLocation = {
      pageNumber: 5,
      spanIndex: 0
    };
    const location2: SpanLocation = {
      pageNumber: 5,
      spanIndex: 1
    };
    const endLocation: SpanLocation = {
      pageNumber: 5,
      spanIndex: 2
    };
    const loc = component.getEndPageLocations(endLocation);
    expect(loc).toEqual([location1, location2, endLocation]);
  });

  it('should get all locations on page', () => {
    const location1: SpanLocation = {
      pageNumber: 2,
      spanIndex: 0
    };
    const location2: SpanLocation = {
      pageNumber: 2,
      spanIndex: 1
    };
    spyOn(component, 'getTextLayerFromLocation').and.returnValue({
      querySelectorAll: (selectors: string) => {
        expect(selectors).toEqual('span:not(.inner-span)');
        return [{}, {}];
      }
    } as unknown as Element);
    const loc = component.getAllLocationsOnPage(2);
    expect(loc).toEqual([location1, location2]);
  });

  it('should get start page locations', () => {
    const startLocation = {
      pageNumber: 4,
      spanIndex: 2
    };
    const location1: SpanLocation = {
      pageNumber: 4,
      spanIndex: 3
    };
    const location2: SpanLocation = {
      pageNumber: 4,
      spanIndex: 4
    };
    spyOn(component, 'getTextLayerFromLocation').and.returnValue({
      querySelectorAll: (selectors: string) => {
        expect(selectors).toEqual('span:not(.inner-span)');
        return [{}, {}, {}, {}, {}];
      }
    } as unknown as Element);
    const loc = component.getStartPageLocations(startLocation);
    expect(loc).toEqual([startLocation, location1, location2]);
  });

  it('should get intervening text layers', () => {
    spyOn(component, 'getTextLayerFromLocation').and.returnValue({} as Element);
    const res = component.getInterveningTextLayers(1, 4);
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(2);
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(3);
    expect(component.getTextLayerFromLocation).toHaveBeenCalledTimes(2);
    expect(res).toEqual([{} as Element, {} as Element]);
  });

  it('should sort selection same page', () => {
    const res = component.sortSelection({
      spanLocations: [
        {
          pageNumber: 2,
          spanIndex: 3
        },
      ]
    },
    {
      spanLocations: [
        {
          pageNumber: 2,
          spanIndex: 1
        }
      ]
    });
    expect(res).toEqual(2);
  });

  it('should sort selection different page', () => {
    const res = component.sortSelection({
      spanLocations: [
        {
          pageNumber: 2,
          spanIndex: 3
        },
      ]
    },
    {
      spanLocations: [
        {
          pageNumber: 3,
          spanIndex: 1
        }
      ]
    });
    expect(res).toEqual(-1);
  });

  it('should sort selection handle empty', () => {
    const res = component.sortSelection({
      spanLocations: []
    },
    {
      spanLocations: []
    });
    expect(res).toEqual(0);
  });

  it('should set classes for item', () => {
    const testLocation = {
      pageNumber: 2,
      spanIndex: 4
    };
    spyOn(component, 'findRangeSections').and.returnValue([ testLocation ]);
    spyOn(component, 'sortSelection').and.callThrough();
    spyOn(component, 'setSpanClassFromLocationMapped');
    const testItem = {
      id: 'testId',
      spanLocations: []
    };
    const list: { id: string, spanLocations: SpanLocation[] }[] = [];
    spyOn(list, 'sort');
    const selectionMap = new Map<Element, Set<string>>();
    const selection = {} as Selection;
    component.setClassesForItem(
      testItem,
      list,
      'match-test',
      selectionMap,
      selection
    );
    expect(component.findRangeSections).toHaveBeenCalledWith(selection);
    expect(component.setSpanClassFromLocationMapped).toHaveBeenCalledWith(
      testLocation,
      'match-test',
      'testId',
      selectionMap
    );
    expect(list.sort).toHaveBeenCalled();
  });

  it('should set classes for item no locations', () => {
    spyOn(component, 'findRangeSections').and.returnValue([]);
    spyOn(component, 'sortSelection').and.callThrough();
    spyOn(component, 'setSpanClassFromLocationMapped');
    const testItem = {
      id: 'testId',
      spanLocations: []
    };
    const list: { id: string, spanLocations: SpanLocation[] }[] = [];
    spyOn(list, 'sort');
    const selectionMap = new Map<Element, Set<string>>();
    const selection = {} as Selection;
    component.setClassesForItem(
      testItem,
      list,
      'match-test',
      selectionMap,
      selection
    );
    expect(component.findRangeSections).toHaveBeenCalledWith(selection);
    expect(component.setSpanClassFromLocationMapped).toHaveBeenCalledTimes(0);
    expect(list.sort).toHaveBeenCalledTimes(0);
  });

  it('should remove selection', () => {
    const location = {
      spanIndex: 2,
      pageNumber: 3
    };
    const selection = {
      spanLocations: [ location ]
    };
    const selectionMap = new Map<Element, Set<string>>();
    spyOn(component, 'removeSpanClassFromLocation');
    component.removeSelection(
      selection,
      'match-test',
      'testId',
      selectionMap
    );
    expect(component.removeSpanClassFromLocation).toHaveBeenCalledWith(
      location,
      'match-test',
      'testId',
      selectionMap
    );
  });

  it('should get span from location', () => {
    const targetSpan = {};
    const textLayer = {
      querySelectorAll: () => {
        return [ {}, {}, targetSpan, {}, {} ];
      }
    } as unknown as HTMLElement;
    const location = {
      pageNumber: 1,
      spanIndex: 2
    };
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(textLayer);
    spyOn(textLayer, 'querySelectorAll').and.callThrough();
    const res = component.getSpanFromLocation(location);
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(1);
    expect(textLayer.querySelectorAll).toHaveBeenCalledWith('span:not(.inner-span)');
    expect(res).toBe(targetSpan as Element);
  });

  it('should get span from location null textlayer', () => {
    const location = {
      pageNumber: 1,
      spanIndex: 2
    };
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(null);
    const res = component.getSpanFromLocation(location);
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(1);
    expect(res).toBeNull();
  });

  it('should get all non same page locations', () => {
    const startLocation: SpanLocation = {
      spanIndex: 3,
      pageNumber: 2
    };
    const startPageLocations = [
      startLocation,
      {
        spanIndex: 4,
        pageNumber: 2
      }
    ];
    const middlePageLocations = [
      {
        spanIndex: 0,
        pageNumber: 3
      }
    ];
    const endLocation: SpanLocation = {
      spanIndex: 2,
      pageNumber: 4
    };
    const endPageLocations = [
      {
        spanIndex: 0,
        pageNumber: 4
      },
      {
        spanIndex: 1,
        pageNumber: 4
      },
      endLocation
    ];
    spyOn(component, 'getStartPageLocations').and.returnValue(startPageLocations);
    spyOn(component, 'getAllLocationsOnPage').and.returnValue(middlePageLocations);
    spyOn(component, 'getEndPageLocations').and.returnValue(endPageLocations);
    const res = component.getAllNonSamePageLocations(startLocation, endLocation);
    expect(res).toEqual([...startPageLocations, ...middlePageLocations, ...endPageLocations]);
    expect(component.getStartPageLocations).toHaveBeenCalledWith(startLocation);
    expect(component.getAllLocationsOnPage).toHaveBeenCalledWith(3);
    expect(component.getEndPageLocations).toHaveBeenCalledWith(endLocation);
  });

  it('should get intervening locations non same page', () => {
    const startLocation: SpanLocation = {
      spanIndex: 3,
      pageNumber: 2
    };
    const endLocation: SpanLocation = {
      spanIndex: 2,
      pageNumber: 4
    };
    const middlePageLocations = [
      {
        spanIndex: 0,
        pageNumber: 3
      },
      {
        spanIndex: 1,
        pageNumber: 3
      },
    ];
    spyOn(component, 'getAllNonSamePageLocations').and.returnValue(middlePageLocations);
    const res = component.getInterveningLocations(startLocation, endLocation);
    expect(component.getAllNonSamePageLocations).toHaveBeenCalledWith(startLocation, endLocation);
    expect(res).toEqual(middlePageLocations);
  });

  it('should get intervening locations same page', () => {
    const startLocation: SpanLocation = {
      spanIndex: 3,
      pageNumber: 2
    };
    const endLocation: SpanLocation = {
      spanIndex: 6,
      pageNumber: 2
    };
    const middlePageLocations = [
      {
        spanIndex: 0,
        pageNumber: 3
      },
      {
        spanIndex: 1,
        pageNumber: 3
      },
    ];
    spyOn(component, 'getSamePageLocations').and.returnValue(middlePageLocations);
    const res = component.getInterveningLocations(startLocation, endLocation);
    expect(component.getSamePageLocations).toHaveBeenCalledWith(startLocation, endLocation);
    expect(res).toEqual(middlePageLocations);
  });

  it('should get intervening locations same span', () => {
    const startLocation: SpanLocation = {
      spanIndex: 3,
      pageNumber: 2
    };
    const endLocation: SpanLocation = {
      spanIndex: 3,
      pageNumber: 2
    };
    const res = component.getInterveningLocations(startLocation, endLocation);
    expect(res).toEqual([startLocation]);
  });

  it('should get span location handle null page and span', () => {
    const startContainer = {} as Node;
    spyOn(component, 'getPageParent').and.returnValue(null);
    spyOn(component, 'getSpan').and.returnValue(null);
    const res = component.getSpanLocation(startContainer);
    expect(component.getSpan).toHaveBeenCalledWith(startContainer);
    expect(component.getPageParent).toHaveBeenCalledWith(startContainer);
    expect(res).toEqual({
      pageNumber: -1,
      spanIndex: -1
    });
  });

  it('should get span location', () => {
    const startContainer = {} as Node;
    const startSpan = {} as HTMLElement;
    const textLayer = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      querySelectorAll: (query: string): unknown[] => {
        return [{}, {}, startSpan, {}];
      }
    };
    const startPage = {
      attributes: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getNamedItem: (att: string) => {
          return {
            value: '3'
          };
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      querySelector: (query: string) => {
        return textLayer;
      }
    } as HTMLElement;
    spyOn(component, 'getPageParent').and.returnValue(startPage);
    spyOn(component, 'getSpan').and.returnValue(startSpan);
    const res = component.getSpanLocation(startContainer);
    expect(component.getSpan).toHaveBeenCalledWith(startContainer);
    expect(component.getPageParent).toHaveBeenCalledWith(startContainer);
    expect(res).toEqual({
      pageNumber: 3,
      spanIndex: 2
    });
  });

  it('should set span class from location', () => {
    const targetSpan = {
      classList: {
        add: (htmlClass: string): void => {
          expect(htmlClass).toEqual('match-test');
        }
      }
    };
    const textLayer = {
      querySelectorAll: (): unknown[] => {
        return [ {}, {}, targetSpan, {}, {} ];
      }
    } as unknown as HTMLElement;
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(textLayer);
    const location = {
      spanIndex: 2,
      pageNumber: 3
    };
    spyOn(targetSpan.classList, 'add').and.callThrough();
    spyOn(textLayer, 'querySelectorAll').and.callThrough();
    component.setSpanClassFromLocation(location, 'match-test');
    expect(targetSpan.classList.add).toHaveBeenCalledWith('match-test');
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(3);
    expect(textLayer.querySelectorAll).toHaveBeenCalledWith('span:not(.inner-span)');
  });

  it('should set span class from location mapped', () => {
    const location = {
      spanIndex: 2,
      pageNumber: 3
    };
    const selectionMap = new Map<Element, Set<string>>();
    const targetSpan = {
      classList: {
        add: (htmlClass: string): void => {
          expect(htmlClass).toEqual('match-test');
        }
      }
    };
    const textLayer = {
      querySelectorAll: () => {
        return [ {}, {}, targetSpan, {}, {} ];
      }
    } as unknown as HTMLElement;
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(textLayer);
    spyOn(targetSpan.classList, 'add').and.callThrough();
    spyOn(textLayer, 'querySelectorAll').and.callThrough();
    component.setSpanClassFromLocationMapped(
      location,
      'match-test',
      'testId',
      selectionMap
    );
    expect(targetSpan.classList.add).toHaveBeenCalledWith('match-test');
    expect(textLayer.querySelectorAll).toHaveBeenCalledWith('span:not(.inner-span)');
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(3);
    expect(selectionMap.get(targetSpan as Element)?.has('testId')).toBeTrue();
  });

  it('should remove span class from location', () => {
    const location = {
      spanIndex: 2,
      pageNumber: 3
    };
    const selectionMap = new Map<Element, Set<string>>();
    const targetSpan = {
      classList: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        remove:(htmlClass: string) => {
        }
      }
    } as Element;
    const testSet = new Set<string>();
    testSet.add('testId');
    selectionMap.set(targetSpan, testSet);
    const textLayer = {
      querySelectorAll: () => {
        return [ {}, {}, targetSpan, {}, {} ];
      }
    } as unknown as HTMLElement;
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(textLayer);
    spyOn(textLayer, 'querySelectorAll').and.callThrough();
    spyOn(targetSpan.classList, 'remove').and.callThrough();
    spyOn(testSet, 'delete').and.callThrough();
    spyOn(document, 'querySelectorAll').and.returnValue([targetSpan] as unknown as NodeListOf<Element>);
    component.removeSpanClassFromLocation(
      location,
      'match-test',
      'testId',
      selectionMap
    );
    expect(testSet.size).toEqual(0);
    expect(testSet.delete).toHaveBeenCalledWith('testId');
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(3);
    expect(textLayer.querySelectorAll).toHaveBeenCalledWith('span:not(.inner-span)');
    expect(targetSpan.classList.remove).toHaveBeenCalledWith(('match-test'));
    expect(targetSpan.classList.remove).toHaveBeenCalledWith(('match-active'));
  });

  it('should remove span class from location no span set', () => {
    const location = {
      spanIndex: 2,
      pageNumber: 3
    };
    const selectionMap = new Map<Element, Set<string>>();
    const targetSpan = {
      classList: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        remove:(htmlClass: string) => {
        }
      }
    } as Element;
    const textLayer = {
      querySelectorAll: () => {
        return [ {}, {}, targetSpan, {}, {} ];
      }
    } as unknown as HTMLElement;
    spyOn(component, 'getTextLayerFromLocation').and.returnValue(textLayer);
    spyOn(textLayer, 'querySelectorAll').and.callThrough();
    spyOn(targetSpan.classList, 'remove').and.callThrough();
    spyOn(document, 'querySelectorAll').and.returnValue([targetSpan] as unknown as NodeListOf<Element>);
    component.removeSpanClassFromLocation(
      location,
      'match-test',
      'testId',
      selectionMap
    );
    expect(component.getTextLayerFromLocation).toHaveBeenCalledWith(3);
    expect(textLayer.querySelectorAll).toHaveBeenCalledWith('span:not(.inner-span)');
    expect(targetSpan.classList.remove).toHaveBeenCalledWith(('match-test'));
    expect(targetSpan.classList.remove).toHaveBeenCalledWith(('match-active'));
  });
});
