import { Pipe, PipeTransform } from '@angular/core';
import { multiCriteriaRegex } from '../utils/search.utils';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  public transform(content: string, criteria: string): string {
    if (!content || !criteria) {
      return content;
    }

    const regex = multiCriteriaRegex(criteria, ' ');

    return content.replace(regex, (match) => {
      return `<span class="match-highlight">${match}</span>`;
    });
  }
}
