import { multiCriteriaRegex } from './search.utils';

describe('Search Utils', () => {
  it('should get search regex', () => {
    const res = multiCriteriaRegex('this,is,a,test', ',');
    expect(res.source).toEqual('this|is|a|test');
  });
});
