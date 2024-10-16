import { SpanLocation } from './span-location.model';

export interface CommentSelection {
  id: string;
  spanLocations: SpanLocation[];
  text: string;
  comment: string;
  editMode: boolean;
  isHovered: boolean;
}
