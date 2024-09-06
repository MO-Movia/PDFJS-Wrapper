import { HighlightPipe } from './highlight.pipe';

describe('Highlight Pipes', () => {
  it('should highlight text', () => {
    const pipe = new HighlightPipe();
    const res = pipe.transform('this is target stuff', 'target');
    expect(res).toEqual(
      'this is <span class="match-highlight">target</span> stuff'
    );
  });

  it('should return content if criteria is empty', () => {
    const pipe = new HighlightPipe();
    const res = pipe.transform('this is target stuff', '');
    expect(res).toEqual('this is target stuff');
  });
});
