import { CommentSelection } from './models/comment-selection.model';
import * as i0 from "@angular/core";
export interface Comment extends CommentSelection {
    text: string;
    comment: string;
}
export interface Highlight {
    text: string;
}
export declare class UtilService {
    tagListPrivate: string[];
    tagListPublic: string[];
    commentList: Comment[];
    highlightList: any[];
    updateTagListPrivate(tagPrivate: string): void;
    getTagListPrivate(): string[];
    updateTagListPublic(tagPublic: string): void;
    getTagListPublic(): string[];
    updateHighlightList(hightlight: any): void;
    gethighlightText(): string[];
    updateComments(comment: Comment): void;
    getCommentList(): Comment[];
    updatedHighlightList(highlight: string[]): void;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<UtilService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UtilService>;
}
