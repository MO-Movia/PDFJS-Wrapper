import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, Output, HostListener, ViewChild, Input } from '@angular/core';
import * as i3 from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as i2$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i4 from 'angular-split';
import { AngularSplitModule } from 'angular-split';
import * as i5 from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as i6 from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import * as i2 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { faFile, faUser, faMessage, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faSliders, faBookOpenReader, faQuoteRight, faArrowTrendUp, faTag, faTrash, faHighlighter } from '@fortawesome/free-solid-svg-icons';

class UtilService {
    updateTagListPrivate(tagPrivate) {
        this.tagListPrivate.push(tagPrivate);
    }
    getTagListPrivate() {
        return this.tagListPrivate;
    }
    updateTagListPublic(tagPublic) {
        this.tagListPublic.push(tagPublic);
    }
    getTagListPublic() {
        return this.tagListPublic;
    }
    updateHighlightList(hightlight) {
        this.highlightList.push(hightlight);
    }
    gethighlightText() {
        return this.highlightList;
    }
    updateComments(comment) {
        this.commentList.push(comment);
    }
    getCommentList() {
        return this.commentList;
    }
    updatedHighlightList(highlight) {
        this.highlightList = highlight.slice();
    }
    constructor() {
        this.tagListPrivate = [];
        this.tagListPublic = [];
        this.commentList = [];
        this.highlightList = [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: UtilService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: UtilService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: UtilService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class CommentPopoverComponent {
    constructor(utilService) {
        this.utilService = utilService;
        this.submitComment = new EventEmitter();
        this.newComment = '';
        this.commentList = [];
        this.closePopover = false;
        this.commentList = this.utilService.getCommentList();
    }
    closeComment() {
        const popover = document.querySelector('.comment-popover-content');
        if (!this.closePopover) {
            popover.style.display = 'none';
        }
        this.closePopover = !this.closePopover;
    }
    onSubmit() {
        if (this.newComment) {
            const selectedTagText = document.querySelector('.selectedEditor');
            const selectedText = selectedTagText.ariaLabel;
            if (selectedText != null) {
                let highlightList = this.utilService.gethighlightText();
                const normalizedTagText = selectedText.trim().toLowerCase();
                if (highlightList.some((word) => word.trim().toLowerCase() === normalizedTagText)) {
                    highlightList = highlightList.filter((word) => word.trim().toLowerCase() !== normalizedTagText);
                    console.log('The updated highlightList is: ', highlightList);
                    this.utilService.updatedHighlightList(highlightList);
                }
                let comment = {
                    text: selectedText,
                    comment: this.newComment,
                    id: '',
                    spanLocations: [],
                    editMode: false,
                    isHovered: false,
                };
                this.utilService.updateComments(comment);
                this.newComment = '';
                console.log(this.commentList);
            }
            this.closeComment();
        }
    }
    handleKeyDown(event) {
        if (event.key === ' ' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            const newValue = value.substring(0, start) + ' ' + value.substring(end);
            this.newComment = newValue;
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
        // else if (event.key === 'Backspace') {
        //   const popover = document.querySelector(
        //     '.comment-popover-content'
        //   ) as HTMLElement;
        //   popover.style.display='block';
        //   const textarea = event.target as HTMLTextAreaElement;
        //   const start = textarea.selectionStart;
        //   const end = textarea.selectionEnd;
        //   // If there's a selection, remove the selected text
        //   if (start !== end) {
        //     const value = textarea.value;
        //     const newValue = value.substring(0, start) + value.substring(end);
        //     this.newComment = newValue;
        //     setTimeout(() => {
        //       textarea.selectionStart = textarea.selectionEnd = start;
        //     }, 0);
        //   } else if (start > 0) { // If no selection, remove the character before the cursor
        //     const value = textarea.value;
        //     const newValue = value.substring(0, start - 1) + value.substring(end);
        //     this.newComment = newValue;
        //     setTimeout(() => {
        //       textarea.selectionStart = textarea.selectionEnd = start - 1;
        //     }, 0);
        //   }
        // }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: CommentPopoverComponent, deps: [{ token: UtilService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: CommentPopoverComponent, isStandalone: true, selector: "mo-app-comment-popover", outputs: { submitComment: "submitComment" }, host: { listeners: { "keydown": "handleKeyDown($event)" } }, ngImport: i0, template: "<div class=\"comment-popover-content\">\r\n  <div class=\"comment-header\">\r\n    <h5>Add Comment</h5>\r\n    <span class=\"close-comment\" tabindex=\"-1\" (click)=\"closeComment()\" (keyup)=\"closeComment()\">x</span>\r\n  </div>\r\n  <div class=\"comment-border\"></div>\r\n  <textarea\r\n    [(ngModel)]=\"newComment\"\r\n    rows=\"4\"\r\n    placeholder=\"Enter your comment\"\r\n    class=\"comment-textarea\"\r\n  ></textarea>\r\n  <div class=\"button-container\">\r\n    <button class=\"submit-button\" (click)=\"onSubmit()\" (keyup)=\"onSubmit()\">\r\n      Submit\r\n    </button>\r\n  </div>\r\n</div>\r\n", styles: [".comment-popover-content{background:#4c4a4a;color:#fff;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all}.comment-textarea{border-radius:4px;margin-top:6px}.comment-border{width:100%;height:1px;background-color:#000;margin:3px 0 6px}.comment-header{display:flex;flex-direction:row}.close-comment{width:10%;display:flex;align-items:center;justify-content:flex-end;font-size:17px;color:#fff;font-weight:600;cursor:pointer;background:transparent}h5{width:90%;margin:6px 0}.button-container{display:flex;justify-content:flex-end;margin-top:10px}.submit-button{background:#1c1c1c82;color:#fff;padding:5px 10px;border:none}.submit-button:hover{background:#000}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: CommentPopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mo-app-comment-popover', standalone: true, imports: [FormsModule], template: "<div class=\"comment-popover-content\">\r\n  <div class=\"comment-header\">\r\n    <h5>Add Comment</h5>\r\n    <span class=\"close-comment\" tabindex=\"-1\" (click)=\"closeComment()\" (keyup)=\"closeComment()\">x</span>\r\n  </div>\r\n  <div class=\"comment-border\"></div>\r\n  <textarea\r\n    [(ngModel)]=\"newComment\"\r\n    rows=\"4\"\r\n    placeholder=\"Enter your comment\"\r\n    class=\"comment-textarea\"\r\n  ></textarea>\r\n  <div class=\"button-container\">\r\n    <button class=\"submit-button\" (click)=\"onSubmit()\" (keyup)=\"onSubmit()\">\r\n      Submit\r\n    </button>\r\n  </div>\r\n</div>\r\n", styles: [".comment-popover-content{background:#4c4a4a;color:#fff;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all}.comment-textarea{border-radius:4px;margin-top:6px}.comment-border{width:100%;height:1px;background-color:#000;margin:3px 0 6px}.comment-header{display:flex;flex-direction:row}.close-comment{width:10%;display:flex;align-items:center;justify-content:flex-end;font-size:17px;color:#fff;font-weight:600;cursor:pointer;background:transparent}h5{width:90%;margin:6px 0}.button-container{display:flex;justify-content:flex-end;margin-top:10px}.submit-button{background:#1c1c1c82;color:#fff;padding:5px 10px;border:none}.submit-button:hover{background:#000}\n"] }]
        }], ctorParameters: () => [{ type: UtilService }], propDecorators: { submitComment: [{
                type: Output
            }], handleKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

class TagPopoverComponent {
    constructor(utilService) {
        this.utilService = utilService;
        this.closePopover = false;
        this.selectedTag = '';
        this.tagListPrivate = [];
        this.tagListPublic = [];
        this.selectedTagPublic = false;
        this.selectedTagPrivate = false;
        this.tagListPrivate = this.utilService.getTagListPrivate();
        this.tagListPublic = this.utilService.getTagListPublic();
    }
    closeTag() {
        const popover = document.querySelector('.tag-popover');
        if (!this.closePopover) {
            popover.style.display = 'none';
        }
        this.closePopover = !this.closePopover;
    }
    storeTag() {
        if (this.selectedTagPublic || this.selectedTagPrivate) {
            const selectedTagText = document.querySelector('.selectedEditor');
            const tagText = selectedTagText?.ariaLabel;
            if (tagText != null) {
                let highlightList = this.utilService.gethighlightText();
                const normalizedTagText = tagText.trim().toLowerCase();
                if (highlightList.some((word) => word.trim().toLowerCase() === normalizedTagText)) {
                    highlightList = highlightList.filter((word) => word.trim().toLowerCase() !== normalizedTagText);
                    console.log('The updated highlightList is: ', highlightList);
                    this.utilService.updatedHighlightList(highlightList);
                }
                if (this.selectedTagPrivate && this.selectedTagPublic) {
                    this.utilService.updateTagListPrivate(tagText);
                    this.utilService.updateTagListPublic(tagText);
                }
                else if (this.selectedTagPrivate) {
                    this.utilService.updateTagListPrivate(tagText);
                }
                else if (this.selectedTagPublic) {
                    this.utilService.updateTagListPublic(tagText);
                }
            }
            this.closeTag();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TagPopoverComponent, deps: [{ token: UtilService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: TagPopoverComponent, isStandalone: true, selector: "mo-app-tag-popover", viewQueries: [{ propertyName: "pdfViewer", first: true, predicate: MoPdfViewerComponent, descendants: true }], ngImport: i0, template: "<div class=\"tag-popover\">\r\n  <h4>Tags</h4>\r\n  <button class=\"close-button\" (click)=\"closeTag()\">x</button>\r\n  <div class=\"col-12 d-flex border-clr pt-1\"></div>\r\n  <input\r\n    type=\"checkbox\"\r\n    id=\"tag-public\"\r\n    [(ngModel)]=\"selectedTagPublic\"\r\n    value=\"Public\"\r\n  />\r\n  <label for=\"tag-public\">Public</label><br />\r\n  <input\r\n    type=\"checkbox\"\r\n    id=\"tag-private\"\r\n    [(ngModel)]=\"selectedTagPrivate\"\r\n    value=\"Private\"\r\n  />\r\n  <label for=\"tag-private\">Private</label><br />\r\n  <button\r\n    class=\"ok-button\"\r\n    [disabled]=\"!(selectedTagPublic || selectedTagPrivate)\"\r\n    (click)=\"storeTag()\"\r\n  >\r\n    OK\r\n  </button>\r\n</div>\r\n", styles: [".tag-popover{background:#4c4a4a;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all;color:#fff;width:143px;height:147px}.tag-popover label{margin-left:6px;font-size:15px;letter-spacing:1px}input{font-size:20px}.border-clr{border-bottom:2px solid rgb(255,255,255)}.ok-button{position:absolute;border:none;color:#fff;width:21px;font-size:12px;height:25px;margin-top:13px;background:#1c1c1c82;letter-spacing:1px}.ok-button:hover{background:#000}.close-button{left:84%;top:0;position:absolute;border:none;font-size:17px;color:#fff;width:16px;font-weight:600;height:24px;background:transparent}#tag-public{margin-top:17px}#tag-private{margin-top:13px}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TagPopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mo-app-tag-popover', standalone: true, imports: [FormsModule], template: "<div class=\"tag-popover\">\r\n  <h4>Tags</h4>\r\n  <button class=\"close-button\" (click)=\"closeTag()\">x</button>\r\n  <div class=\"col-12 d-flex border-clr pt-1\"></div>\r\n  <input\r\n    type=\"checkbox\"\r\n    id=\"tag-public\"\r\n    [(ngModel)]=\"selectedTagPublic\"\r\n    value=\"Public\"\r\n  />\r\n  <label for=\"tag-public\">Public</label><br />\r\n  <input\r\n    type=\"checkbox\"\r\n    id=\"tag-private\"\r\n    [(ngModel)]=\"selectedTagPrivate\"\r\n    value=\"Private\"\r\n  />\r\n  <label for=\"tag-private\">Private</label><br />\r\n  <button\r\n    class=\"ok-button\"\r\n    [disabled]=\"!(selectedTagPublic || selectedTagPrivate)\"\r\n    (click)=\"storeTag()\"\r\n  >\r\n    OK\r\n  </button>\r\n</div>\r\n", styles: [".tag-popover{background:#4c4a4a;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all;color:#fff;width:143px;height:147px}.tag-popover label{margin-left:6px;font-size:15px;letter-spacing:1px}input{font-size:20px}.border-clr{border-bottom:2px solid rgb(255,255,255)}.ok-button{position:absolute;border:none;color:#fff;width:21px;font-size:12px;height:25px;margin-top:13px;background:#1c1c1c82;letter-spacing:1px}.ok-button:hover{background:#000}.close-button{left:84%;top:0;position:absolute;border:none;font-size:17px;color:#fff;width:16px;font-weight:600;height:24px;background:transparent}#tag-public{margin-top:17px}#tag-private{margin-top:13px}\n"] }]
        }], ctorParameters: () => [{ type: UtilService }], propDecorators: { pdfViewer: [{
                type: ViewChild,
                args: [MoPdfViewerComponent]
            }] } });

class MoPdfViewerComponent {
    ngOnInit() {
        const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
        pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
        this.NodeObjectArray();
    }
    constructor(resolver, injector, appRef, elementRef, utilService, renderer) {
        this.resolver = resolver;
        this.injector = injector;
        this.appRef = appRef;
        this.elementRef = elementRef;
        this.utilService = utilService;
        this.renderer = renderer;
        this.pdfSrc = '';
        this.documentTitle = '';
        this.documentClassification = 'Unclassified';
        this.documentAuthor = '';
        this.minimalView = false;
        this.tagListPublic = [];
        this.tagListPrivate = [];
        this.commentList = [];
        this.isOpenTag = false;
        this.isOpenComment = false;
        this.publicListVisible = false;
        this.privateListVisible = false;
        this.isHovered = false;
        // highlightTextArray: string[] = [];
        this.commentTextArray = [];
        this.commentDetails = null;
        this.tagDetails = null;
        this.previousScrollTop = 0;
        this.previousScrollLeft = 0;
        this.highlightList = [];
        this.dropdownVisible = {};
        this.hoveredList = null;
        this.hoveredIndex = null;
        this.I = {
            faFile,
            faUser,
            faSliders,
            faBookOpenReader,
            faMessage,
            faQuoteRight,
            faArrowTrendUp,
            faThumbsUp,
            faTag,
            faTrash,
            faHighlighter,
        };
        this.searchCategories = [
            {
                label: 'Highlights',
                icon: faHighlighter,
            },
            {
                label: 'Tags',
                icon: faTag,
            },
            {
                label: 'Comments',
                icon: faMessage,
            },
        ];
        this.selectedSearchCategory = 'Highlights';
        this.onDocumentClickTag = (event) => {
            if (this.popoverRef && this.popoverRef.hostView) {
                const clickedInsidePopover = this.popoverRef.hostView.rootNodes[0].contains(event.target);
                const tagElements = document.querySelectorAll('.tag');
                let clickedInsideTag = false;
                tagElements.forEach((tagElement) => {
                    if (tagElement.contains(event.target)) {
                        clickedInsideTag = true;
                    }
                });
                if (!clickedInsidePopover && !clickedInsideTag) {
                    const popover = document.querySelector('.tag-popover');
                    if (this.isOpenTag) {
                        popover.style.display = 'none';
                    }
                    this.isOpenTag = false;
                }
                if (clickedInsidePopover) {
                    this.highlightList = this.utilService.gethighlightText();
                }
            }
        };
        this.onDocumentClickComment = (event) => {
            if (this.popoverRef && this.popoverRef.hostView) {
                const clickedInsidePopover = this.popoverRef.hostView.rootNodes[0].contains(event.target);
                const commentElements = document.querySelectorAll('.comment');
                let clickedInsidecomment = false;
                commentElements.forEach((commentElement) => {
                    if (commentElement.contains(event.target)) {
                        clickedInsidecomment = true;
                    }
                });
                if (!clickedInsidePopover && !clickedInsidecomment) {
                    const popover = document.querySelector('.comment-popover-content');
                    if (this.isOpenComment) {
                        popover.style.display = 'none';
                    }
                    this.isOpenTag = false;
                }
                if (clickedInsidePopover) {
                    this.highlightList = this.utilService.gethighlightText();
                }
            }
        };
        this.onPdfViewerScroll = () => {
            if (this.popoverRef && this.commentDetails && this.tagDetails) {
                const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
                this.previousScrollTop = pdfViewerElement.scrollTop;
                this.previousScrollLeft = pdfViewerElement.scrollLeft;
            }
        };
        this.highlightList = utilService.gethighlightText();
        this.tagListPublic = utilService.getTagListPublic();
        this.tagListPrivate = utilService.getTagListPrivate();
        this.commentList = utilService.getCommentList();
    }
    NodeObjectArray() {
        const pdfObject = {
            tagListPrivate: this.utilService.getTagListPrivate(),
            tagListPublic: this.utilService.getTagListPublic(),
            commentList: this.utilService.getCommentList(),
            highlightList: this.utilService.gethighlightText()
        };
        console.log(pdfObject);
        let objArray = [{ objId: 1, objValue: pdfObject }];
        console.log(objArray[0].objId);
        console.log(objArray[0].objValue);
    }
    selectSearchCategory(category) {
        this.selectedSearchCategory = category;
    }
    showHighlightedArray(data) {
        console.log('data:', data);
        const currentEditorValues = Array.from(data.highlightedText.parent.editors.values());
        for (const [key, value] of data.highlightedText.parent.editors.entries()) {
            console.log('Editor key:', key);
        }
        if (data.highlightedText) {
            this.highlightText = data.highlightedText.text;
            this.textType = data.highlightedText.type;
        }
        else {
            this.highlightText = undefined;
            this.textType = undefined;
        }
        if (this.highlightText !== undefined && this.textType !== undefined) {
            if (this.textType === 'Highlight') {
                if (!this.highlightList.includes(this.highlightText)) {
                    this.highlightList.push(this.highlightText);
                }
            }
            //  else if (this.textType === 'Comment') {
            //   if (!this.commentTextArray.includes(this.highlightText)) {
            //     this.commentTextArray.push(this.highlightText);
            //   }
            // }
        }
        // this.highlightList = this.highlightList.filter((text) =>
        //   currentEditorValues.some((editor) => editor.text === text)
        // );
        // console.log('highlight array', this.highlightTextArray);
    }
    commentTagPopover(data) {
        console.log('commentTagPopover called with data:', data);
        if (data.detail.type === 'Comment') {
            this.showCommentPopover(data.detail);
        }
        else if (data.detail.type === 'Tag') {
            this.showTagPopover(data.detail);
        }
    }
    showTagPopover(tagDetails) {
        console.log('showTagPopover called with tagDetails:', tagDetails);
        this.closeCommentPopover();
        this.isOpenTag = true;
        const popoverFactory = this.resolver.resolveComponentFactory(TagPopoverComponent);
        this.popoverRef = popoverFactory.create(this.injector);
        this.appRef.attachView(this.popoverRef.hostView);
        const popoverElement = this.popoverRef.hostView
            .rootNodes[0];
        popoverElement.style.display = 'block';
        let tagValue = null;
        for (let [key, value] of tagDetails.parent.editors) {
            console.log(`Key: ${key}`);
            console.log('Value:', value);
            tagValue = value.div;
        }
        if (tagValue) {
            const selectedText = document.querySelector('.highlightEditor.selectedEditor');
            selectedText.appendChild(popoverElement);
        }
        this.tagDetails = tagDetails;
        const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
        pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
        pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
        this.renderer.listen('document', 'click', this.onDocumentClickTag);
    }
    showCommentPopover(commentDetails) {
        this.closeCommentPopover();
        this.isOpenComment = true;
        const popoverFactory = this.resolver.resolveComponentFactory(CommentPopoverComponent);
        this.popoverRef = popoverFactory.create(this.injector);
        this.appRef.attachView(this.popoverRef.hostView);
        const popoverElement = this.popoverRef.hostView
            .rootNodes[0];
        popoverElement.style.display = 'block';
        let commentValue = null;
        for (let [key, value] of commentDetails.parent.editors) {
            console.log(`Key: ${key}`);
            console.log('Value:', value);
            commentValue = value.div;
        }
        if (commentValue) {
            const selectedText = document.querySelector('.highlightEditor.selectedEditor');
            selectedText.appendChild(popoverElement);
        }
        this.commentDetails = commentDetails;
        const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
        pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
        pdfViewerElement.addEventListener('scroll', this.onPdfViewerScroll);
        this.renderer.listen('document', 'click', this.onDocumentClickComment);
    }
    scrollToText(highlight) {
        const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
        if (pdfViewerElement && highlight) {
            const textElements = pdfViewerElement.querySelectorAll('.highlightEditor');
            if (textElements.length === 0) {
                console.log(`No elements with class '.highlightEditor' found in the PDF.`);
                return;
            }
            let foundElement = null;
            textElements.forEach((element) => {
                if (element.ariaLabel === highlight) {
                    foundElement = element;
                }
            });
            if (foundElement) {
                foundElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            else {
                console.log(`Text '${highlight}' not found in PDF.`);
            }
        }
    }
    closeCommentPopover() {
        if (this.popoverRef) {
            this.appRef.detachView(this.popoverRef.hostView);
            this.popoverRef.destroy();
            this.popoverRef = null;
            this.commentDetails = null;
            const pdfViewerElement = this.elementRef.nativeElement.querySelector('ngx-extended-pdf-viewer');
            pdfViewerElement.removeEventListener('scroll', this.onPdfViewerScroll);
        }
    }
    commntDropdownVisible(element) {
        const allDropdowns = document.querySelectorAll('.dropdown-content');
        allDropdowns.forEach((dropdown) => {
            dropdown.style.display = 'none';
        });
        const parentSpan = element.closest('.icon-span');
        if (parentSpan) {
            const dropdownContent = parentSpan.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'block';
                const hideDropdown = (event) => {
                    if (!parentSpan.contains(event.target)) {
                        dropdownContent.style.display = 'none';
                        document.removeEventListener('click', hideDropdown);
                    }
                };
                setTimeout(() => {
                    document.addEventListener('click', hideDropdown);
                }, 0);
            }
        }
    }
    enableSubmitButton(comment, submitButton) {
        const textAreaValue = comment.comment && comment.comment.trim().length > 0;
        if (submitButton) {
            if (textAreaValue) {
                submitButton.removeAttribute('disabled');
                submitButton.style.background = '#545050';
            }
            else {
                submitButton.setAttribute('disabled', 'true');
            }
        }
    }
    submitComment(comment, submitButton) {
        console.log(this.commentList);
        comment.editMode = false;
        submitButton.setAttribute('disabled', 'true');
    }
    editComment(comment) {
        comment.editMode = true;
    }
    removeComment(comment) {
        const index = this.commentList.findIndex((c) => c.comment === comment.comment);
        if (index > -1) {
            this.commentList.splice(index, 1);
        }
    }
    removeTag(type, index) {
        if (type === 'public') {
            this.tagListPublic.splice(index, 1);
        }
        else if (type === 'private') {
            this.tagListPrivate.splice(index, 1);
        }
    }
    closeCommentTextarea(comment) {
        comment.editMode = false;
    }
    tagPublicVisibility() {
        this.publicListVisible = !this.publicListVisible;
    }
    tagPrivateVisibility() {
        this.privateListVisible = !this.privateListVisible;
    }
    showMenu(comment) {
        comment.isHovered = true;
    }
    hideMenu(comment) {
        comment.isHovered = false;
    }
    onMouseEnter(list, index) {
        this.hoveredIndex = index;
        this.hoveredList = list;
    }
    onMouseLeave() {
        this.hoveredIndex = null;
        this.hoveredList = null;
    }
    ngOnDestroy() {
        this.closeCommentPopover;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: MoPdfViewerComponent, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.Injector }, { token: i0.ApplicationRef }, { token: i0.ElementRef }, { token: UtilService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: MoPdfViewerComponent, isStandalone: true, selector: "mo-pdf-viewer", inputs: { pdfSrc: "pdfSrc", documentTitle: "documentTitle", documentClassification: "documentClassification", documentAuthor: "documentAuthor", minimalView: "minimalView" }, providers: [provideAnimations()], viewQueries: [{ propertyName: "pdfComponent", first: true, predicate: NgxExtendedPdfViewerComponent, descendants: true }, { propertyName: "tagPopoverComponent", first: true, predicate: TagPopoverComponent, descendants: true }], ngImport: i0, template: "<div class=\"container-fluid h-100\">\r\n  <as-split direction=\"horizontal\">\r\n    <as-split-area [size]=\"70\" style=\"scrollbar-width: none\">\r\n      <div class=\"row h-100\">\r\n        <div class=\"row flex-grow-1\">\r\n          <div class=\"col h-100\">\r\n            <ngx-extended-pdf-viewer\r\n              #pdfViewer\r\n              (commentTagEvent)=\"commentTagPopover($event)\"\r\n              (highlightArrayEvent)=\"showHighlightedArray($event)\"\r\n              [minifiedJSLibraries]=\"false\"\r\n              [customToolbar]=\"additionalButtons\"\r\n              [src]=\"pdfSrc\"\r\n              [textLayer]=\"true\"\r\n            >\r\n            </ngx-extended-pdf-viewer>\r\n            <ng-template #additionalButtons>\r\n              <div id=\"toolbarViewer\">\r\n                <div id=\"toolbarViewerLeft\">\r\n                  <pdf-toggle-sidebar></pdf-toggle-sidebar>\r\n                  <div class=\"toolbarButtonSpacer\"></div>\r\n                  <pdf-find-button\r\n                    [showFindButton]=\"true\"\r\n                    [textLayer]=\"true\"\r\n                  ></pdf-find-button>\r\n                  <pdf-paging-area></pdf-paging-area>\r\n                </div>\r\n                <pdf-zoom-toolbar></pdf-zoom-toolbar>\r\n                <div id=\"toolbarViewerRight\">\r\n                  <pdf-highlight-editor></pdf-highlight-editor>\r\n                </div>\r\n              </div>\r\n            </ng-template>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </as-split-area>\r\n    <as-split-area [size]=\"30\" class=\"right-panel\">\r\n      <div\r\n        class=\"search-category\"\r\n        *ngIf=\"selectedSearchCategory === 'Highlights'\"\r\n      >\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Highlights:</h3>\r\n          </div>\r\n        </div>\r\n        <div class=\"row flex-grow-1 tag-container\">\r\n          <div class=\"highlightlist\">\r\n            <ng-container\r\n              *ngFor=\"let highlight of highlightList; let i = index\"\r\n            >\r\n              <div\r\n                class=\"highlight-list\"\r\n                (mouseenter)=\"onMouseEnter('highlight', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"highlights-list\">\r\n                    <div\r\n                    (click)=\"scrollToText(highlight)\"\r\n                    >\r\n                      {{\r\n                        highlight.length > 25\r\n                          ? highlight.substring(0, 25) + \"...\"\r\n                          : highlight\r\n                      }}\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n        <div class=\"row highlight-container\"></div>\r\n      </div>\r\n\r\n      <div class=\"search-category\" *ngIf=\"selectedSearchCategory === 'Tags'\">\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Tags:</h3>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"row flex-grow-1 tag-container\">\r\n          <div class=\"publicList\">\r\n            <svg\r\n              class=\"collapse-svg\"\r\n              xmlns=\"http://www.w3.org/2000/svg\"\r\n              viewBox=\"0 0 448 512\"\r\n              (click)=\"tagPublicVisibility()\"\r\n              [style.rotate]=\"publicListVisible ? '0deg' : '180deg'\"\r\n            >\r\n              <path\r\n                d=\"M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z\"\r\n              />\r\n            </svg>\r\n            <h6 class=\"tag-type\">Public</h6>\r\n            <div class=\"tag-public-count\">\r\n              {{ tagListPublic.length }}\r\n            </div>\r\n            <div *ngIf=\"publicListVisible\">\r\n              <div\r\n                *ngFor=\"let tagPublic of tagListPublic; let i = index\"\r\n                class=\"publicList\"\r\n                (mouseenter)=\"onMouseEnter('public', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"tag-list\">\r\n                    <div>\r\n                      {{\r\n                        tagPublic.length > 25\r\n                          ? tagPublic.substring(0, 25) + \"...\"\r\n                          : tagPublic\r\n                      }}\r\n                      <p\r\n                        tabindex=\"-1\"\r\n                        class=\"public-item-close\"\r\n                        [class.visible]=\"\r\n                          hoveredIndex === i && hoveredList === 'public'\r\n                        \"\r\n                        (click)=\"removeTag('public', i)\"\r\n                        (keyup)=\"removeTag('public', i)\"\r\n                      >\r\n                        X\r\n                      </p>\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"privateList\">\r\n            <svg\r\n              class=\"collapse-svg\"\r\n              xmlns=\"http://www.w3.org/2000/svg\"\r\n              viewBox=\"0 0 448 512\"\r\n              (click)=\"tagPrivateVisibility()\"\r\n              [style.rotate]=\"privateListVisible ? '0deg' : '180deg'\"\r\n            >\r\n              <path\r\n                d=\"M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z\"\r\n              />\r\n            </svg>\r\n            <h6 class=\"tag-type\">Private</h6>\r\n            <div class=\"tag-private-count\">\r\n              {{ tagListPrivate.length }}\r\n            </div>\r\n            <div *ngIf=\"privateListVisible\">\r\n              <div\r\n                *ngFor=\"let tagPrivate of tagListPrivate; let i = index\"\r\n                class=\"privateList\"\r\n                (mouseenter)=\"onMouseEnter('private', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"tag-list\">\r\n                    <div>\r\n                      {{\r\n                        tagPrivate.length > 25\r\n                          ? tagPrivate.substring(0, 25) + \"...\"\r\n                          : tagPrivate\r\n                      }}\r\n                      <p\r\n                        tabindex=\"-1\"\r\n                        class=\"private-item-close\"\r\n                        [class.visible]=\"\r\n                          hoveredIndex === i && hoveredList === 'private'\r\n                        \"\r\n                        (click)=\"removeTag('private', i)\"\r\n                        (keyup)=\"removeTag('private', i)\"\r\n                      >\r\n                        X\r\n                      </p>\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div\r\n        class=\"search-category\"\r\n        *ngIf=\"selectedSearchCategory === 'Comments'\"\r\n      >\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Notes:</h3>\r\n          </div>\r\n        </div>\r\n        <div class=\"row flex-grow-1 comment-container\">\r\n          <div class=\"col h-100 mt-2\">\r\n            <div\r\n              *ngFor=\"let comment of commentList\"\r\n              class=\"row mx-2 clickable align-items-center\"\r\n              id=\"comment-row\"\r\n              [attr.tabindex]=\"0\"\r\n              tabindex=\"-1\"\r\n            >\r\n              <div class=\"col\">\r\n                <div class=\"row row_comments container-icon\">\r\n                  <div\r\n                    class=\"col-12 comment-box\"\r\n                    style=\"position: relative\"\r\n                    tabindex=\"-1\"\r\n                    (mouseenter)=\"showMenu(comment)\"\r\n                    (mouseleave)=\"hideMenu(comment)\"\r\n                  >\r\n                    {{\r\n                      comment.comment.length > 30\r\n                        ? comment.comment.substring(0, 30) + \"...\"\r\n                        : comment.comment\r\n                    }}\r\n                  </div>\r\n                  <span\r\n                    class=\"icon-span\"\r\n                    [ngStyle]=\"{\r\n                      display: comment.isHovered ? 'inline' : 'none'\r\n                    }\"\r\n                    style=\"position: absolute; right: 0; cursor: pointer\"\r\n                    (mouseenter)=\"showMenu(comment)\"\r\n                    (mouseleave)=\"hideMenu(comment)\"\r\n                  >\r\n                    <svg\r\n                      xmlns=\"http://www.w3.org/2000/svg\"\r\n                      width=\"16\"\r\n                      height=\"16\"\r\n                      fill=\"currentColor\"\r\n                      class=\"bi bi-three-dots-vertical\"\r\n                      viewBox=\"0 0 16 16\"\r\n                      id=\"comment-dropdown\"\r\n                      #commentDropdown\r\n                      (click)=\"commntDropdownVisible(commentDropdown)\"\r\n                    >\r\n                      <path\r\n                        d=\"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0\"\r\n                      />\r\n                    </svg>\r\n                    <ul\r\n                      class=\"dropdown-content\"\r\n                      *ngIf=\"dropdownVisible\"\r\n                      style=\"top: 16px; display: none\"\r\n                    >\r\n                      <li\r\n                        (click)=\"removeComment(comment)\"\r\n                        tabindex=\"-1\"\r\n                        style=\"height: 35px\"\r\n                      >\r\n                        Delete\r\n                        <button\r\n                          type=\"button\"\r\n                          title=\"Remove Comment\"\r\n                          class=\"btn btn-danger btn-sm ms-1\"\r\n                          id=\"trash_button_comment\"\r\n                          (click)=\"removeComment(comment)\"\r\n                        >\r\n                          <fa-icon\r\n                            class=\"mx-auto my-auto\"\r\n                            id=\"trash_icon_comment\"\r\n                            [icon]=\"I.faTrash\"\r\n                          />\r\n                        </button>\r\n                      </li>\r\n                      <li\r\n                        (click)=\"editComment(comment)\"\r\n                        *ngIf=\"!comment.editMode\"\r\n                        tabindex=\"-1\"\r\n                        style=\"height: 35px\"\r\n                      >\r\n                        Edit\r\n                        <button\r\n                          *ngIf=\"!comment.editMode\"\r\n                          type=\"button\"\r\n                          title=\"Edit Comment\"\r\n                          class=\"btn btn-primary btn-sm ms-1\"\r\n                          id=\"edit_button_comment\"\r\n                          (click)=\"editComment(comment)\"\r\n                        >\r\n                          <svg\r\n                            xmlns=\"http://www.w3.org/2000/svg\"\r\n                            viewBox=\"0 0 576 512\"\r\n                            class=\"edit_comment_svg\"\r\n                            id=\"edit_icon_comment\"\r\n                          >\r\n                            <path\r\n                              d=\"M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1 .8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z\"\r\n                            />\r\n                          </svg>\r\n                        </button>\r\n                      </li>\r\n                    </ul>\r\n                  </span>\r\n                </div>\r\n\r\n                <div class=\"row mt-2\">\r\n                  <div class=\"ms-3 w-100\">\r\n                    <div *ngIf=\"comment.editMode\">\r\n                      <textarea\r\n                        placeholder=\"Type your Reply\"\r\n                        title=\"Comment\"\r\n                        class=\"form-control \"\r\n                        id=\"comments-textarea\"\r\n                        [(ngModel)]=\"comment.comment\"\r\n                        (input)=\"enableSubmitButton(comment, submitButton)\"\r\n                      ></textarea>\r\n                      <button\r\n                        #submitButton\r\n                        class=\"button comment_submit btn btn-primary btn-sm\"\r\n                        (click)=\"submitComment(comment, submitButton)\"\r\n                        disabled\r\n                      >\r\n                        Submit\r\n                      </button>\r\n                      <button\r\n                        class=\"button close-comment btn btn-primary btn-sm\"\r\n                        (click)=\"closeCommentTextarea(comment)\"\r\n                      >\r\n                        Close\r\n                      </button>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row ms-2\">\r\n        <ul\r\n          ngbNav\r\n          #nav=\"ngbNav\"\r\n          class=\"nav nav-pills nav-tabs\"\r\n          orientation=\"vertical\"\r\n          tabindex=\"-1\"\r\n        >\r\n          <ng-container *ngFor=\"let category of searchCategories\">\r\n            <li\r\n              class=\"ccc clickable top-category\"\r\n              [class.active-top-category]=\"\r\n                selectedSearchCategory === category.label\r\n              \"\r\n              (click)=\"selectSearchCategory(category.label)\"\r\n              (keyup.enter)=\"selectSearchCategory(category.label)\"\r\n              [ngbTooltip]=\"category.label\"\r\n              tabindex=\"-1\"\r\n            >\r\n              <a class=\"nav-link\">\r\n                <div class=\"row d-flex my-2\">\r\n                  <div class=\"col-auto mx-auto right-icons\">\r\n                    <fa-icon\r\n                      class=\"mx-auto my-auto\"\r\n                      size=\"2x\"\r\n                      [icon]=\"category.icon\"\r\n                    ></fa-icon>\r\n                  </div>\r\n                </div>\r\n              </a>\r\n            </li>\r\n          </ng-container>\r\n        </ul>\r\n      </div>\r\n    </as-split-area>\r\n  </as-split>\r\n</div>\r\n", styles: [":host ::ng-deep .ng2-pdf-viewer-container .match-comment{text-decoration:underline;text-decoration-color:#00f;text-decoration-thickness:3px;color:#000;opacity:1}:host ::ng-deep .ng2-pdf-viewer-container .match-active{color:#000;opacity:.5}:host ::ng-deep .ng2-pdf-viewer-container .match-highlight{background-color:#ff0;color:#000;opacity:1}:host ::ng-deep .ng2-pdf-viewer-container .match-tag{text-decoration:underline;text-decoration-color:green;text-decoration-thickness:3px;color:#000;opacity:2}:host ::ng-deep .ng2-pdf-viewer-container .textLayer{opacity:.4}.section-container-left{background-color:#f8f8f8}.section-container-right{background-color:#f2f2f2}.info-row{background-color:#dadada}.icon-circle{height:1.5rem;aspect-ratio:1/1;background-color:#d3d3d3}.doc-name{font-weight:700}.top-category{border:solid transparent 1px;align-items:center;padding-right:0;height:39px}.active-top-category{color:#000;background-color:#fff;filter:brightness(125%);border-color:#0c0c0c;border-radius:var(--bs-nav-pills-border-radius)}.active-top-category .nav-link{color:#000;background-color:#fff}.light-gray-background{background-color:#d3d3d3}.preview-full-view{width:100%}.page-container{width:100%;height:calc(100vh - 98px)}.nav-link{padding:.5rem;background-color:#f5f5f5;margin-top:.5px;height:36px;color:#a9a9a9;font-size:10px;display:flex;align-content:center;flex-wrap:wrap;border-color:#a9a9a9}.nav-link:hover{color:#fff;background-color:#5a5858}.nav-tabs{min-width:40px}.outlet{width:calc(100% - 40px);height:100%;padding:0 .5rem}.icon-button{all:unset;color:#a9a9a9}.mo-border{border-bottom:.06rem solid var(--bs-gray-500)}.right-panel{order:2;flex:0 0 calc(43.634% - 4.79973px);display:inline-flex;justify-content:space-between;background-color:#fff}.right-icons{font-size:9px}.nav-container{background-color:#fff}.highlight-col{position:relative;padding-left:0}#search_svg_icon{width:12px}.down_btn:hover,.up_btn:hover{cursor:pointer;color:var(--bs-gray-100);filter:brightness(150%)}.form-control:focus{box-shadow:none}.ng2-pdf-viewer-container{background:#d3d3d3}#my-auto-page{color:#837a7a}.comment_submit{background:#dbd5d5}.close-comment{background-color:#545050}#search_box_pdf{left:-305px;width:188px;border-top:none;border-left:none;border-right:none;border-bottom:2px solid black;top:5px}.header_bottom_bar{width:370px;position:absolute;top:34px;height:1px;left:-329px;background:#000}.header_seperator{height:31px;width:1px;background:#000;position:absolute;left:-71px}.down_btn{border:none;width:24px;rotate:180deg;background:#fff}.up_btn{border:none;width:24px;background:#fff}#close_button_header{width:40px;font-size:19px;border:none;height:35px;font-weight:700;margin-top:-3px}#trash_button{position:absolute;top:1px;width:21px;height:22px;right:1px;z-index:1;visibility:hidden}#trash_icon_highlight{width:5px;position:absolute;top:-1px;right:11px;height:14px}#trash_button_tag{position:absolute;top:2px;width:21px;height:21px;right:1px;z-index:1;visibility:hidden}#trash_icon_tag{position:absolute;top:-2px;right:11px;width:4px;height:5px}.row_highlight{position:relative}.row_highlight:hover #trash_button,.row_tag:hover #trash_button_tag{visibility:visible}#trash_button_comment{position:absolute;top:11px;width:20px;height:22px;right:3px;z-index:1}#trash_icon_comment{position:absolute;top:-1px;right:10px;width:5px;height:14px}#comment-row{position:relative;margin:16px}#comments-textarea{margin-left:-16px}#edit_button_comment{position:absolute;top:36px;width:25px;height:22px;right:3px;z-index:1;background:transparent;border:none}.edit_comment_svg{width:24px;height:24px;position:absolute;top:1px;right:-3px;filter:contrast(.5)}.comment-box{cursor:pointer;padding-right:38px}.comment-box:hover,.comment-box:hover+.icon-span{background-color:#dbd5d5}.container-icon:hover{background-color:#dbd5d5}#tag-box{cursor:pointer;padding-right:38px;position:relative}#highlight-span{cursor:pointer;padding-right:38px}.flex-grow-1{display:block}#comment-dropdown{margin-top:2px;border-radius:2px;font-size:25px;color:#161616;position:absolute;top:5px;right:0}.dropdown-content{border-radius:4px;position:absolute;background-color:#6b6666;color:#ebebeb;min-width:125px;box-shadow:0 8px 16px #0003;z-index:4;top:100%;right:0;padding:0;margin:5px 15px 0 0;display:flex;flex-direction:column;font-weight:400;font-size:16px;font-stretch:normal;letter-spacing:normal}.dropdown-content li{list-style-type:none;padding:0 0 0 10px;text-align:center;flex:1;display:flex;justify-content:left;align-items:center;line-height:35px}.search-category{width:100%}.right-panel-title{font-size:23px;margin-top:16px}.button{margin:10px;border:none}.tag-type{margin-left:30px}.privateList,.publicList,.highlight-list{margin:2px 15px -27px 14px;border-radius:5px}.tag-list,.highlight-list{width:78%;margin:-25px 0 30px}.privateList .tag-list:hover{background-color:#dbd5d5;margin-left:2px;cursor:pointer}.highlights-list{list-style-type:none}.highlights-list:hover{background-color:#dbd5d5}.publicList .tag-list:hover{background-color:#dbd5d5;margin-left:2px;cursor:pointer}.collapse-svg{height:25px;width:22px;cursor:pointer;rotate:180deg;fill:#686161;position:relative;top:22px}.publicList .public-item-close:hover,.privateList .private-item-close:hover,.highlightlist .highlight-close:hover{color:#807d7d}.highlightlist{margin-top:32px;margin-left:-11px}.private-item-close{cursor:pointer;text-align:center;width:23px;margin-left:88%;margin-top:-24px;font-weight:600;visibility:hidden}.private-item-close.visible,.public-item-close.visible .highlight-close.visible{visibility:visible}.public-item-close,.highlight-close{cursor:pointer;text-align:center;width:23px;margin-left:88%;margin-top:-24px;font-weight:600;visibility:hidden}.tag-public-count,.tag-private-count{position:relative;left:73%;border-radius:50%;background:#c1c0be;text-align:center;width:22px;cursor:pointer;bottom:31px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2$1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: FontAwesomeModule }, { kind: "component", type: i3.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "animation", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "ngmodule", type: AngularSplitModule }, { kind: "component", type: i4.SplitComponent, selector: "as-split", inputs: ["direction", "unit", "gutterSize", "gutterStep", "restrictMove", "useTransition", "disabled", "dir", "gutterDblClickDuration", "gutterClickDeltaPx", "gutterAriaLabel"], outputs: ["transitionEnd", "dragStart", "dragEnd", "gutterClick", "gutterDblClick"], exportAs: ["asSplit"] }, { kind: "directive", type: i4.SplitAreaDirective, selector: "as-split-area, [as-split-area]", inputs: ["order", "size", "minSize", "maxSize", "lockSize", "visible"], exportAs: ["asSplitArea"] }, { kind: "ngmodule", type: NgbNavModule }, { kind: "directive", type: i5.NgbNav, selector: "[ngbNav]", inputs: ["activeId", "animation", "destroyOnHide", "orientation", "roles", "keyboard"], outputs: ["activeIdChange", "shown", "hidden", "navChange"], exportAs: ["ngbNav"] }, { kind: "ngmodule", type: NgbTooltipModule }, { kind: "directive", type: i5.NgbTooltip, selector: "[ngbTooltip]", inputs: ["animation", "autoClose", "placement", "popperOptions", "triggers", "positionTarget", "container", "disableTooltip", "tooltipClass", "tooltipContext", "openDelay", "closeDelay", "ngbTooltip"], outputs: ["shown", "hidden"], exportAs: ["ngbTooltip"] }, { kind: "ngmodule", type: NgxExtendedPdfViewerModule }, { kind: "component", type: i6.NgxExtendedPdfViewerComponent, selector: "ngx-extended-pdf-viewer", inputs: ["customFindbarInputArea", "customToolbar", "customFindbar", "customFindbarButtons", "customPdfViewer", "customSecondaryToolbar", "customSidebar", "customThumbnail", "customFreeFloatingBar", "showFreeFloatingBar", "enableDragAndDrop", "formData", "disableForms", "pageViewMode", "scrollMode", "authorization", "httpHeaders", "contextMenuAllowed", "enablePrint", "delayFirstView", "showTextEditor", "showStampEditor", "showDrawEditor", "showHighlightEditor", "logLevel", "relativeCoordsOptions", "minifiedJSLibraries", "printResolution", "rotation", "src", "base64Src", "minHeight", "height", "forceUsingLegacyES5", "backgroundColor", "filenameForDownload", "ignoreKeyboard", "ignoreKeys", "acceptKeys", "imageResourcesPath", "localeFolderPath", "language", "listenToURL", "nameddest", "password", "replaceBrowserPrint", "showUnverifiedSignatures", "startTabindex", "showSidebarButton", "sidebarVisible", "activeSidebarView", "findbarVisible", "propertiesDialogVisible", "showFindButton", "showFindHighlightAll", "showFindMatchCase", "showFindCurrentPageOnly", "showFindPageRange", "showFindEntireWord", "showFindEntirePhrase", "showFindMatchDiacritics", "showFindFuzzySearch", "showFindResultsCount", "showFindMessages", "showPagingButtons", "showZoomButtons", "showPresentationModeButton", "showOpenFileButton", "showPrintButton", "showDownloadButton", "theme", "showToolbar", "showSecondaryToolbarButton", "showSinglePageModeButton", "showVerticalScrollButton", "showHorizontalScrollButton", "showWrappedScrollButton", "showInfiniteScrollButton", "showBookModeButton", "showRotateButton", "showRotateCwButton", "showRotateCcwButton", "handTool", "showHandToolButton", "showScrollingButton", "showSpreadButton", "showPropertiesButton", "showBorders", "spread", "page", "pageLabel", "textLayer", "zoom", "zoomLevels", "maxZoom", "minZoom", "mobileFriendlyZoom"], outputs: ["annotationEditorEvent", "commentTagEvent", "highlightArrayEvent", "formDataChange", "pageViewModeChange", "progress", "srcChange", "scrollModeChange", "afterPrint", "beforePrint", "currentZoomFactor", "rotationChange", "annotationLayerRendered", "annotationEditorLayerRendered", "xfaLayerRendered", "outlineLoaded", "attachmentsloaded", "layersloaded", "sidebarVisibleChange", "activeSidebarViewChange", "findbarVisibleChange", "propertiesDialogVisibleChange", "handToolChange", "spreadChange", "thumbnailDrawn", "pageChange", "pageLabelChange", "pagesLoaded", "pageRender", "pageRendered", "pdfDownloaded", "pdfLoaded", "pdfLoadingStarts", "pdfLoadingFailed", "textLayerRendered", "annotationEditorModeChanged", "updateFindMatchesCount", "updateFindState", "zoomChange"] }, { kind: "component", type: i6.PdfFindButtonComponent, selector: "pdf-find-button", inputs: ["showFindButton", "textLayer", "findbarVisible"] }, { kind: "component", type: i6.PdfHighlightEditorComponent, selector: "pdf-highlight-editor", inputs: ["show"] }, { kind: "component", type: i6.PdfPagingAreaComponent, selector: "pdf-paging-area", inputs: ["showPagingButtons"] }, { kind: "component", type: i6.PdfToggleSidebarComponent, selector: "pdf-toggle-sidebar", inputs: ["show", "sidebarVisible"], outputs: ["showChange"] }, { kind: "component", type: i6.PdfZoomToolbarComponent, selector: "pdf-zoom-toolbar", inputs: ["showZoomButtons", "zoomLevels"] }, { kind: "ngmodule", type: NgbModule }, { kind: "ngmodule", type: BrowserAnimationsModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: MoPdfViewerComponent, decorators: [{
            type: Component,
            args: [{ standalone: true, imports: [
                        CommonModule,
                        FontAwesomeModule,
                        AngularSplitModule,
                        NgbNavModule,
                        NgbTooltipModule,
                        NgxExtendedPdfViewerModule,
                        NgbModule,
                        BrowserAnimationsModule,
                        FormsModule,
                    ], providers: [provideAnimations()], selector: 'mo-pdf-viewer', template: "<div class=\"container-fluid h-100\">\r\n  <as-split direction=\"horizontal\">\r\n    <as-split-area [size]=\"70\" style=\"scrollbar-width: none\">\r\n      <div class=\"row h-100\">\r\n        <div class=\"row flex-grow-1\">\r\n          <div class=\"col h-100\">\r\n            <ngx-extended-pdf-viewer\r\n              #pdfViewer\r\n              (commentTagEvent)=\"commentTagPopover($event)\"\r\n              (highlightArrayEvent)=\"showHighlightedArray($event)\"\r\n              [minifiedJSLibraries]=\"false\"\r\n              [customToolbar]=\"additionalButtons\"\r\n              [src]=\"pdfSrc\"\r\n              [textLayer]=\"true\"\r\n            >\r\n            </ngx-extended-pdf-viewer>\r\n            <ng-template #additionalButtons>\r\n              <div id=\"toolbarViewer\">\r\n                <div id=\"toolbarViewerLeft\">\r\n                  <pdf-toggle-sidebar></pdf-toggle-sidebar>\r\n                  <div class=\"toolbarButtonSpacer\"></div>\r\n                  <pdf-find-button\r\n                    [showFindButton]=\"true\"\r\n                    [textLayer]=\"true\"\r\n                  ></pdf-find-button>\r\n                  <pdf-paging-area></pdf-paging-area>\r\n                </div>\r\n                <pdf-zoom-toolbar></pdf-zoom-toolbar>\r\n                <div id=\"toolbarViewerRight\">\r\n                  <pdf-highlight-editor></pdf-highlight-editor>\r\n                </div>\r\n              </div>\r\n            </ng-template>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </as-split-area>\r\n    <as-split-area [size]=\"30\" class=\"right-panel\">\r\n      <div\r\n        class=\"search-category\"\r\n        *ngIf=\"selectedSearchCategory === 'Highlights'\"\r\n      >\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Highlights:</h3>\r\n          </div>\r\n        </div>\r\n        <div class=\"row flex-grow-1 tag-container\">\r\n          <div class=\"highlightlist\">\r\n            <ng-container\r\n              *ngFor=\"let highlight of highlightList; let i = index\"\r\n            >\r\n              <div\r\n                class=\"highlight-list\"\r\n                (mouseenter)=\"onMouseEnter('highlight', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"highlights-list\">\r\n                    <div\r\n                    (click)=\"scrollToText(highlight)\"\r\n                    >\r\n                      {{\r\n                        highlight.length > 25\r\n                          ? highlight.substring(0, 25) + \"...\"\r\n                          : highlight\r\n                      }}\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </div>\r\n        <div class=\"row highlight-container\"></div>\r\n      </div>\r\n\r\n      <div class=\"search-category\" *ngIf=\"selectedSearchCategory === 'Tags'\">\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Tags:</h3>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"row flex-grow-1 tag-container\">\r\n          <div class=\"publicList\">\r\n            <svg\r\n              class=\"collapse-svg\"\r\n              xmlns=\"http://www.w3.org/2000/svg\"\r\n              viewBox=\"0 0 448 512\"\r\n              (click)=\"tagPublicVisibility()\"\r\n              [style.rotate]=\"publicListVisible ? '0deg' : '180deg'\"\r\n            >\r\n              <path\r\n                d=\"M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z\"\r\n              />\r\n            </svg>\r\n            <h6 class=\"tag-type\">Public</h6>\r\n            <div class=\"tag-public-count\">\r\n              {{ tagListPublic.length }}\r\n            </div>\r\n            <div *ngIf=\"publicListVisible\">\r\n              <div\r\n                *ngFor=\"let tagPublic of tagListPublic; let i = index\"\r\n                class=\"publicList\"\r\n                (mouseenter)=\"onMouseEnter('public', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"tag-list\">\r\n                    <div>\r\n                      {{\r\n                        tagPublic.length > 25\r\n                          ? tagPublic.substring(0, 25) + \"...\"\r\n                          : tagPublic\r\n                      }}\r\n                      <p\r\n                        tabindex=\"-1\"\r\n                        class=\"public-item-close\"\r\n                        [class.visible]=\"\r\n                          hoveredIndex === i && hoveredList === 'public'\r\n                        \"\r\n                        (click)=\"removeTag('public', i)\"\r\n                        (keyup)=\"removeTag('public', i)\"\r\n                      >\r\n                        X\r\n                      </p>\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"privateList\">\r\n            <svg\r\n              class=\"collapse-svg\"\r\n              xmlns=\"http://www.w3.org/2000/svg\"\r\n              viewBox=\"0 0 448 512\"\r\n              (click)=\"tagPrivateVisibility()\"\r\n              [style.rotate]=\"privateListVisible ? '0deg' : '180deg'\"\r\n            >\r\n              <path\r\n                d=\"M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z\"\r\n              />\r\n            </svg>\r\n            <h6 class=\"tag-type\">Private</h6>\r\n            <div class=\"tag-private-count\">\r\n              {{ tagListPrivate.length }}\r\n            </div>\r\n            <div *ngIf=\"privateListVisible\">\r\n              <div\r\n                *ngFor=\"let tagPrivate of tagListPrivate; let i = index\"\r\n                class=\"privateList\"\r\n                (mouseenter)=\"onMouseEnter('private', i)\"\r\n                (mouseleave)=\"onMouseLeave()\"\r\n              >\r\n                <ul class=\"col\">\r\n                  <li class=\"tag-list\">\r\n                    <div>\r\n                      {{\r\n                        tagPrivate.length > 25\r\n                          ? tagPrivate.substring(0, 25) + \"...\"\r\n                          : tagPrivate\r\n                      }}\r\n                      <p\r\n                        tabindex=\"-1\"\r\n                        class=\"private-item-close\"\r\n                        [class.visible]=\"\r\n                          hoveredIndex === i && hoveredList === 'private'\r\n                        \"\r\n                        (click)=\"removeTag('private', i)\"\r\n                        (keyup)=\"removeTag('private', i)\"\r\n                      >\r\n                        X\r\n                      </p>\r\n                    </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div\r\n        class=\"search-category\"\r\n        *ngIf=\"selectedSearchCategory === 'Comments'\"\r\n      >\r\n        <div class=\"row ms-2\">\r\n          <div class=\"col\">\r\n            <h3 class=\"right-panel-title\">Notes:</h3>\r\n          </div>\r\n        </div>\r\n        <div class=\"row flex-grow-1 comment-container\">\r\n          <div class=\"col h-100 mt-2\">\r\n            <div\r\n              *ngFor=\"let comment of commentList\"\r\n              class=\"row mx-2 clickable align-items-center\"\r\n              id=\"comment-row\"\r\n              [attr.tabindex]=\"0\"\r\n              tabindex=\"-1\"\r\n            >\r\n              <div class=\"col\">\r\n                <div class=\"row row_comments container-icon\">\r\n                  <div\r\n                    class=\"col-12 comment-box\"\r\n                    style=\"position: relative\"\r\n                    tabindex=\"-1\"\r\n                    (mouseenter)=\"showMenu(comment)\"\r\n                    (mouseleave)=\"hideMenu(comment)\"\r\n                  >\r\n                    {{\r\n                      comment.comment.length > 30\r\n                        ? comment.comment.substring(0, 30) + \"...\"\r\n                        : comment.comment\r\n                    }}\r\n                  </div>\r\n                  <span\r\n                    class=\"icon-span\"\r\n                    [ngStyle]=\"{\r\n                      display: comment.isHovered ? 'inline' : 'none'\r\n                    }\"\r\n                    style=\"position: absolute; right: 0; cursor: pointer\"\r\n                    (mouseenter)=\"showMenu(comment)\"\r\n                    (mouseleave)=\"hideMenu(comment)\"\r\n                  >\r\n                    <svg\r\n                      xmlns=\"http://www.w3.org/2000/svg\"\r\n                      width=\"16\"\r\n                      height=\"16\"\r\n                      fill=\"currentColor\"\r\n                      class=\"bi bi-three-dots-vertical\"\r\n                      viewBox=\"0 0 16 16\"\r\n                      id=\"comment-dropdown\"\r\n                      #commentDropdown\r\n                      (click)=\"commntDropdownVisible(commentDropdown)\"\r\n                    >\r\n                      <path\r\n                        d=\"M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0\"\r\n                      />\r\n                    </svg>\r\n                    <ul\r\n                      class=\"dropdown-content\"\r\n                      *ngIf=\"dropdownVisible\"\r\n                      style=\"top: 16px; display: none\"\r\n                    >\r\n                      <li\r\n                        (click)=\"removeComment(comment)\"\r\n                        tabindex=\"-1\"\r\n                        style=\"height: 35px\"\r\n                      >\r\n                        Delete\r\n                        <button\r\n                          type=\"button\"\r\n                          title=\"Remove Comment\"\r\n                          class=\"btn btn-danger btn-sm ms-1\"\r\n                          id=\"trash_button_comment\"\r\n                          (click)=\"removeComment(comment)\"\r\n                        >\r\n                          <fa-icon\r\n                            class=\"mx-auto my-auto\"\r\n                            id=\"trash_icon_comment\"\r\n                            [icon]=\"I.faTrash\"\r\n                          />\r\n                        </button>\r\n                      </li>\r\n                      <li\r\n                        (click)=\"editComment(comment)\"\r\n                        *ngIf=\"!comment.editMode\"\r\n                        tabindex=\"-1\"\r\n                        style=\"height: 35px\"\r\n                      >\r\n                        Edit\r\n                        <button\r\n                          *ngIf=\"!comment.editMode\"\r\n                          type=\"button\"\r\n                          title=\"Edit Comment\"\r\n                          class=\"btn btn-primary btn-sm ms-1\"\r\n                          id=\"edit_button_comment\"\r\n                          (click)=\"editComment(comment)\"\r\n                        >\r\n                          <svg\r\n                            xmlns=\"http://www.w3.org/2000/svg\"\r\n                            viewBox=\"0 0 576 512\"\r\n                            class=\"edit_comment_svg\"\r\n                            id=\"edit_icon_comment\"\r\n                          >\r\n                            <path\r\n                              d=\"M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1 .8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z\"\r\n                            />\r\n                          </svg>\r\n                        </button>\r\n                      </li>\r\n                    </ul>\r\n                  </span>\r\n                </div>\r\n\r\n                <div class=\"row mt-2\">\r\n                  <div class=\"ms-3 w-100\">\r\n                    <div *ngIf=\"comment.editMode\">\r\n                      <textarea\r\n                        placeholder=\"Type your Reply\"\r\n                        title=\"Comment\"\r\n                        class=\"form-control \"\r\n                        id=\"comments-textarea\"\r\n                        [(ngModel)]=\"comment.comment\"\r\n                        (input)=\"enableSubmitButton(comment, submitButton)\"\r\n                      ></textarea>\r\n                      <button\r\n                        #submitButton\r\n                        class=\"button comment_submit btn btn-primary btn-sm\"\r\n                        (click)=\"submitComment(comment, submitButton)\"\r\n                        disabled\r\n                      >\r\n                        Submit\r\n                      </button>\r\n                      <button\r\n                        class=\"button close-comment btn btn-primary btn-sm\"\r\n                        (click)=\"closeCommentTextarea(comment)\"\r\n                      >\r\n                        Close\r\n                      </button>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row ms-2\">\r\n        <ul\r\n          ngbNav\r\n          #nav=\"ngbNav\"\r\n          class=\"nav nav-pills nav-tabs\"\r\n          orientation=\"vertical\"\r\n          tabindex=\"-1\"\r\n        >\r\n          <ng-container *ngFor=\"let category of searchCategories\">\r\n            <li\r\n              class=\"ccc clickable top-category\"\r\n              [class.active-top-category]=\"\r\n                selectedSearchCategory === category.label\r\n              \"\r\n              (click)=\"selectSearchCategory(category.label)\"\r\n              (keyup.enter)=\"selectSearchCategory(category.label)\"\r\n              [ngbTooltip]=\"category.label\"\r\n              tabindex=\"-1\"\r\n            >\r\n              <a class=\"nav-link\">\r\n                <div class=\"row d-flex my-2\">\r\n                  <div class=\"col-auto mx-auto right-icons\">\r\n                    <fa-icon\r\n                      class=\"mx-auto my-auto\"\r\n                      size=\"2x\"\r\n                      [icon]=\"category.icon\"\r\n                    ></fa-icon>\r\n                  </div>\r\n                </div>\r\n              </a>\r\n            </li>\r\n          </ng-container>\r\n        </ul>\r\n      </div>\r\n    </as-split-area>\r\n  </as-split>\r\n</div>\r\n", styles: [":host ::ng-deep .ng2-pdf-viewer-container .match-comment{text-decoration:underline;text-decoration-color:#00f;text-decoration-thickness:3px;color:#000;opacity:1}:host ::ng-deep .ng2-pdf-viewer-container .match-active{color:#000;opacity:.5}:host ::ng-deep .ng2-pdf-viewer-container .match-highlight{background-color:#ff0;color:#000;opacity:1}:host ::ng-deep .ng2-pdf-viewer-container .match-tag{text-decoration:underline;text-decoration-color:green;text-decoration-thickness:3px;color:#000;opacity:2}:host ::ng-deep .ng2-pdf-viewer-container .textLayer{opacity:.4}.section-container-left{background-color:#f8f8f8}.section-container-right{background-color:#f2f2f2}.info-row{background-color:#dadada}.icon-circle{height:1.5rem;aspect-ratio:1/1;background-color:#d3d3d3}.doc-name{font-weight:700}.top-category{border:solid transparent 1px;align-items:center;padding-right:0;height:39px}.active-top-category{color:#000;background-color:#fff;filter:brightness(125%);border-color:#0c0c0c;border-radius:var(--bs-nav-pills-border-radius)}.active-top-category .nav-link{color:#000;background-color:#fff}.light-gray-background{background-color:#d3d3d3}.preview-full-view{width:100%}.page-container{width:100%;height:calc(100vh - 98px)}.nav-link{padding:.5rem;background-color:#f5f5f5;margin-top:.5px;height:36px;color:#a9a9a9;font-size:10px;display:flex;align-content:center;flex-wrap:wrap;border-color:#a9a9a9}.nav-link:hover{color:#fff;background-color:#5a5858}.nav-tabs{min-width:40px}.outlet{width:calc(100% - 40px);height:100%;padding:0 .5rem}.icon-button{all:unset;color:#a9a9a9}.mo-border{border-bottom:.06rem solid var(--bs-gray-500)}.right-panel{order:2;flex:0 0 calc(43.634% - 4.79973px);display:inline-flex;justify-content:space-between;background-color:#fff}.right-icons{font-size:9px}.nav-container{background-color:#fff}.highlight-col{position:relative;padding-left:0}#search_svg_icon{width:12px}.down_btn:hover,.up_btn:hover{cursor:pointer;color:var(--bs-gray-100);filter:brightness(150%)}.form-control:focus{box-shadow:none}.ng2-pdf-viewer-container{background:#d3d3d3}#my-auto-page{color:#837a7a}.comment_submit{background:#dbd5d5}.close-comment{background-color:#545050}#search_box_pdf{left:-305px;width:188px;border-top:none;border-left:none;border-right:none;border-bottom:2px solid black;top:5px}.header_bottom_bar{width:370px;position:absolute;top:34px;height:1px;left:-329px;background:#000}.header_seperator{height:31px;width:1px;background:#000;position:absolute;left:-71px}.down_btn{border:none;width:24px;rotate:180deg;background:#fff}.up_btn{border:none;width:24px;background:#fff}#close_button_header{width:40px;font-size:19px;border:none;height:35px;font-weight:700;margin-top:-3px}#trash_button{position:absolute;top:1px;width:21px;height:22px;right:1px;z-index:1;visibility:hidden}#trash_icon_highlight{width:5px;position:absolute;top:-1px;right:11px;height:14px}#trash_button_tag{position:absolute;top:2px;width:21px;height:21px;right:1px;z-index:1;visibility:hidden}#trash_icon_tag{position:absolute;top:-2px;right:11px;width:4px;height:5px}.row_highlight{position:relative}.row_highlight:hover #trash_button,.row_tag:hover #trash_button_tag{visibility:visible}#trash_button_comment{position:absolute;top:11px;width:20px;height:22px;right:3px;z-index:1}#trash_icon_comment{position:absolute;top:-1px;right:10px;width:5px;height:14px}#comment-row{position:relative;margin:16px}#comments-textarea{margin-left:-16px}#edit_button_comment{position:absolute;top:36px;width:25px;height:22px;right:3px;z-index:1;background:transparent;border:none}.edit_comment_svg{width:24px;height:24px;position:absolute;top:1px;right:-3px;filter:contrast(.5)}.comment-box{cursor:pointer;padding-right:38px}.comment-box:hover,.comment-box:hover+.icon-span{background-color:#dbd5d5}.container-icon:hover{background-color:#dbd5d5}#tag-box{cursor:pointer;padding-right:38px;position:relative}#highlight-span{cursor:pointer;padding-right:38px}.flex-grow-1{display:block}#comment-dropdown{margin-top:2px;border-radius:2px;font-size:25px;color:#161616;position:absolute;top:5px;right:0}.dropdown-content{border-radius:4px;position:absolute;background-color:#6b6666;color:#ebebeb;min-width:125px;box-shadow:0 8px 16px #0003;z-index:4;top:100%;right:0;padding:0;margin:5px 15px 0 0;display:flex;flex-direction:column;font-weight:400;font-size:16px;font-stretch:normal;letter-spacing:normal}.dropdown-content li{list-style-type:none;padding:0 0 0 10px;text-align:center;flex:1;display:flex;justify-content:left;align-items:center;line-height:35px}.search-category{width:100%}.right-panel-title{font-size:23px;margin-top:16px}.button{margin:10px;border:none}.tag-type{margin-left:30px}.privateList,.publicList,.highlight-list{margin:2px 15px -27px 14px;border-radius:5px}.tag-list,.highlight-list{width:78%;margin:-25px 0 30px}.privateList .tag-list:hover{background-color:#dbd5d5;margin-left:2px;cursor:pointer}.highlights-list{list-style-type:none}.highlights-list:hover{background-color:#dbd5d5}.publicList .tag-list:hover{background-color:#dbd5d5;margin-left:2px;cursor:pointer}.collapse-svg{height:25px;width:22px;cursor:pointer;rotate:180deg;fill:#686161;position:relative;top:22px}.publicList .public-item-close:hover,.privateList .private-item-close:hover,.highlightlist .highlight-close:hover{color:#807d7d}.highlightlist{margin-top:32px;margin-left:-11px}.private-item-close{cursor:pointer;text-align:center;width:23px;margin-left:88%;margin-top:-24px;font-weight:600;visibility:hidden}.private-item-close.visible,.public-item-close.visible .highlight-close.visible{visibility:visible}.public-item-close,.highlight-close{cursor:pointer;text-align:center;width:23px;margin-left:88%;margin-top:-24px;font-weight:600;visibility:hidden}.tag-public-count,.tag-private-count{position:relative;left:73%;border-radius:50%;background:#c1c0be;text-align:center;width:22px;cursor:pointer;bottom:31px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }, { type: i0.Injector }, { type: i0.ApplicationRef }, { type: i0.ElementRef }, { type: UtilService }, { type: i0.Renderer2 }], propDecorators: { pdfSrc: [{
                type: Input,
                args: [{ required: true }]
            }], documentTitle: [{
                type: Input
            }], documentClassification: [{
                type: Input
            }], documentAuthor: [{
                type: Input
            }], minimalView: [{
                type: Input
            }], pdfComponent: [{
                type: ViewChild,
                args: [NgxExtendedPdfViewerComponent]
            }], tagPopoverComponent: [{
                type: ViewChild,
                args: [TagPopoverComponent]
            }] } });

/*
 * Public API Surface of mo-pdf-viewer
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MoPdfViewerComponent };
//# sourceMappingURL=modusoperandi-pdf-viewer.mjs.map
