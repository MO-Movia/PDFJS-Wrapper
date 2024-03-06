import { SpanLocation } from './span-location.model';

export interface HighlightSelection {
  id: string;
  spanLocations: SpanLocation[];
  text: string;
}
