export function multiCriteriaRegex(criteria: string,
  separator: string): RegExp {
  const words = criteria.split(separator).join('|');
  return new RegExp(words, 'gi');
}
