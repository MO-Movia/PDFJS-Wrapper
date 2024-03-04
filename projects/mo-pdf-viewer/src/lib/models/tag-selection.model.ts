import { SpanLocation } from './span-location.model';
import { Tag } from './tag.model';

export interface TagSelection {
  id: string;
  spanLocations: SpanLocation[];
  text: string;
  tags: Tag[];
}
