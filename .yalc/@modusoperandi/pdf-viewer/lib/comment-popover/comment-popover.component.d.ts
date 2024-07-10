import { EventEmitter } from '@angular/core';
import { UtilService } from '../util.service';
import { Comment } from '../util.service';
import * as i0 from "@angular/core";
export declare class CommentPopoverComponent {
    utilService: UtilService;
    submitComment: EventEmitter<string>;
    newComment: string;
    commentList: Comment[];
    closePopover: boolean;
    constructor(utilService: UtilService);
    closeComment(): void;
    onSubmit(): void;
    handleKeyDown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CommentPopoverComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CommentPopoverComponent, "mo-app-comment-popover", never, {}, { "submitComment": "submitComment"; }, never, never, true, never>;
}
