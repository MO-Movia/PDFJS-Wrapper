import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "../util.service";
import * as i2 from "@angular/forms";
export class CommentPopoverComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: CommentPopoverComponent, deps: [{ token: i1.UtilService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.11", type: CommentPopoverComponent, isStandalone: true, selector: "mo-app-comment-popover", outputs: { submitComment: "submitComment" }, host: { listeners: { "keydown": "handleKeyDown($event)" } }, ngImport: i0, template: "<div class=\"comment-popover-content\">\r\n  <div class=\"comment-header\">\r\n    <h5>Add Comment</h5>\r\n    <span class=\"close-comment\" tabindex=\"-1\" (click)=\"closeComment()\" (keyup)=\"closeComment()\">x</span>\r\n  </div>\r\n  <div class=\"comment-border\"></div>\r\n  <textarea\r\n    [(ngModel)]=\"newComment\"\r\n    rows=\"4\"\r\n    placeholder=\"Enter your comment\"\r\n    class=\"comment-textarea\"\r\n  ></textarea>\r\n  <div class=\"button-container\">\r\n    <button class=\"submit-button\" (click)=\"onSubmit()\" (keyup)=\"onSubmit()\">\r\n      Submit\r\n    </button>\r\n  </div>\r\n</div>\r\n", styles: [".comment-popover-content{background:#4c4a4a;color:#fff;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all}.comment-textarea{border-radius:4px;margin-top:6px}.comment-border{width:100%;height:1px;background-color:#000;margin:3px 0 6px}.comment-header{display:flex;flex-direction:row}.close-comment{width:10%;display:flex;align-items:center;justify-content:flex-end;font-size:17px;color:#fff;font-weight:600;cursor:pointer;background:transparent}h5{width:90%;margin:6px 0}.button-container{display:flex;justify-content:flex-end;margin-top:10px}.submit-button{background:#1c1c1c82;color:#fff;padding:5px 10px;border:none}.submit-button:hover{background:#000}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: CommentPopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mo-app-comment-popover', standalone: true, imports: [FormsModule], template: "<div class=\"comment-popover-content\">\r\n  <div class=\"comment-header\">\r\n    <h5>Add Comment</h5>\r\n    <span class=\"close-comment\" tabindex=\"-1\" (click)=\"closeComment()\" (keyup)=\"closeComment()\">x</span>\r\n  </div>\r\n  <div class=\"comment-border\"></div>\r\n  <textarea\r\n    [(ngModel)]=\"newComment\"\r\n    rows=\"4\"\r\n    placeholder=\"Enter your comment\"\r\n    class=\"comment-textarea\"\r\n  ></textarea>\r\n  <div class=\"button-container\">\r\n    <button class=\"submit-button\" (click)=\"onSubmit()\" (keyup)=\"onSubmit()\">\r\n      Submit\r\n    </button>\r\n  </div>\r\n</div>\r\n", styles: [".comment-popover-content{background:#4c4a4a;color:#fff;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px #0000001a;font-size:small;position:absolute;top:65px;pointer-events:all}.comment-textarea{border-radius:4px;margin-top:6px}.comment-border{width:100%;height:1px;background-color:#000;margin:3px 0 6px}.comment-header{display:flex;flex-direction:row}.close-comment{width:10%;display:flex;align-items:center;justify-content:flex-end;font-size:17px;color:#fff;font-weight:600;cursor:pointer;background:transparent}h5{width:90%;margin:6px 0}.button-container{display:flex;justify-content:flex-end;margin-top:10px}.submit-button{background:#1c1c1c82;color:#fff;padding:5px 10px;border:none}.submit-button:hover{background:#000}\n"] }]
        }], ctorParameters: () => [{ type: i1.UtilService }], propDecorators: { submitComment: [{
                type: Output
            }], handleKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC1wb3BvdmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29tbWVudC1wb3BvdmVyL2NvbW1lbnQtcG9wb3Zlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbW1lbnQtcG9wb3Zlci9jb21tZW50LXBvcG92ZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFXN0MsTUFBTSxPQUFPLHVCQUF1QjtJQU1sQyxZQUFtQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUwxQixrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDckQsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixnQkFBVyxHQUFjLEVBQUUsQ0FBQztRQUM1QixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUduQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVNLFlBQVk7UUFDakIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDcEMsMEJBQTBCLENBQ1osQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDekMsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixNQUFNLGVBQWUs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O1FBQzdFLGtDQUFrQztRQUNsQyx5QkFBeUI7UUFDekIscUVBQXFFO1FBQ3JFLGFBQWE7UUFDYixNQUFNO1FBQ04sSUFBSTtJQUNOLENBQUM7K0dBaEdVLHVCQUF1QjttR0FBdkIsdUJBQXVCLDRMQ1pwQywybUJBa0JBLDB5QkRSWSxXQUFXOzs0RkFFVix1QkFBdUI7a0JBUG5DLFNBQVM7K0JBQ0Usd0JBQXdCLGNBR3RCLElBQUksV0FDUCxDQUFDLFdBQVcsQ0FBQztnRkFHTCxhQUFhO3NCQUE3QixNQUFNO2dCQXdEUCxhQUFhO3NCQURaLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBVdGlsU2VydmljZSB9IGZyb20gJy4uL3V0aWwuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1lbnQgfSBmcm9tICcuLi91dGlsLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdtby1hcHAtY29tbWVudC1wb3BvdmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vY29tbWVudC1wb3BvdmVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jb21tZW50LXBvcG92ZXIuY29tcG9uZW50LnNjc3MnXSxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtGb3Jtc01vZHVsZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb21tZW50UG9wb3ZlckNvbXBvbmVudCB7XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBzdWJtaXRDb21tZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgcHVibGljIG5ld0NvbW1lbnQ6IHN0cmluZyA9ICcnO1xyXG4gIHB1YmxpYyBjb21tZW50TGlzdDogQ29tbWVudFtdID0gW107XHJcbiAgcHVibGljIGNsb3NlUG9wb3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLmNvbW1lbnRMaXN0ID0gdGhpcy51dGlsU2VydmljZS5nZXRDb21tZW50TGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlQ29tbWVudCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBvcG92ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAnLmNvbW1lbnQtcG9wb3Zlci1jb250ZW50J1xyXG4gICAgKSBhcyBIVE1MRWxlbWVudDtcclxuICAgIGlmICghdGhpcy5jbG9zZVBvcG92ZXIpIHtcclxuICAgICAgcG9wb3Zlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jbG9zZVBvcG92ZXIgPSAhdGhpcy5jbG9zZVBvcG92ZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25TdWJtaXQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5uZXdDb21tZW50KSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFnVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgJy5zZWxlY3RlZEVkaXRvcidcclxuICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gc2VsZWN0ZWRUYWdUZXh0LmFyaWFMYWJlbDtcclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZFRleHQgIT0gbnVsbCkge1xyXG4gICAgICAgIGxldCBoaWdobGlnaHRMaXN0ID0gdGhpcy51dGlsU2VydmljZS5nZXRoaWdobGlnaHRUZXh0KCk7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRhZ1RleHQgPSBzZWxlY3RlZFRleHQudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgaGlnaGxpZ2h0TGlzdC5zb21lKFxyXG4gICAgICAgICAgICAod29yZCkgPT4gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gbm9ybWFsaXplZFRhZ1RleHRcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGhpZ2hsaWdodExpc3QgPSBoaWdobGlnaHRMaXN0LmZpbHRlcihcclxuICAgICAgICAgICAgKHdvcmQpID0+IHdvcmQudHJpbSgpLnRvTG93ZXJDYXNlKCkgIT09IG5vcm1hbGl6ZWRUYWdUZXh0XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RoZSB1cGRhdGVkIGhpZ2hsaWdodExpc3QgaXM6ICcsIGhpZ2hsaWdodExpc3QpO1xyXG4gICAgICAgICAgdGhpcy51dGlsU2VydmljZS51cGRhdGVkSGlnaGxpZ2h0TGlzdChoaWdobGlnaHRMaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1lbnQ6IENvbW1lbnQgPSB7XHJcbiAgICAgICAgICB0ZXh0OiBzZWxlY3RlZFRleHQsXHJcbiAgICAgICAgICBjb21tZW50OiB0aGlzLm5ld0NvbW1lbnQsXHJcbiAgICAgICAgICBpZDogJycsXHJcbiAgICAgICAgICBzcGFuTG9jYXRpb25zOiBbXSxcclxuICAgICAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgICAgIGlzSG92ZXJlZDogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnV0aWxTZXJ2aWNlLnVwZGF0ZUNvbW1lbnRzKGNvbW1lbnQpO1xyXG4gICAgICAgIHRoaXMubmV3Q29tbWVudCA9ICcnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29tbWVudExpc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2xvc2VDb21tZW50KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxyXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGlmIChldmVudC5rZXkgPT09ICcgJyAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb25cclxuICAgICAgY29uc3QgdGV4dGFyZWEgPSBldmVudC50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgICAgY29uc3Qgc3RhcnQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgY29uc3QgZW5kID0gdGV4dGFyZWEuc2VsZWN0aW9uRW5kO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IHRleHRhcmVhLnZhbHVlO1xyXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyAnICcgKyB2YWx1ZS5zdWJzdHJpbmcoZW5kKTtcclxuICAgICAgdGhpcy5uZXdDb21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0ID0gdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyAxO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH1cclxuICAgIC8vIGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScpIHtcclxuICAgIC8vICAgY29uc3QgcG9wb3ZlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAvLyAgICAgJy5jb21tZW50LXBvcG92ZXItY29udGVudCdcclxuICAgIC8vICAgKSBhcyBIVE1MRWxlbWVudDtcclxuICAgIC8vICAgcG9wb3Zlci5zdHlsZS5kaXNwbGF5PSdibG9jayc7XHJcbiAgICAvLyAgIGNvbnN0IHRleHRhcmVhID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICAvLyAgIGNvbnN0IHN0YXJ0ID0gdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAvLyAgIGNvbnN0IGVuZCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZDtcclxuXHJcbiAgICAvLyAgIC8vIElmIHRoZXJlJ3MgYSBzZWxlY3Rpb24sIHJlbW92ZSB0aGUgc2VsZWN0ZWQgdGV4dFxyXG4gICAgLy8gICBpZiAoc3RhcnQgIT09IGVuZCkge1xyXG4gICAgLy8gICAgIGNvbnN0IHZhbHVlID0gdGV4dGFyZWEudmFsdWU7XHJcbiAgICAvLyAgICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnQpICsgdmFsdWUuc3Vic3RyaW5nKGVuZCk7XHJcbiAgICAvLyAgICAgdGhpcy5uZXdDb21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAvLyAgICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZCA9IHN0YXJ0O1xyXG4gICAgLy8gICAgIH0sIDApO1xyXG4gICAgLy8gICB9IGVsc2UgaWYgKHN0YXJ0ID4gMCkgeyAvLyBJZiBubyBzZWxlY3Rpb24sIHJlbW92ZSB0aGUgY2hhcmFjdGVyIGJlZm9yZSB0aGUgY3Vyc29yXHJcbiAgICAvLyAgICAgY29uc3QgdmFsdWUgPSB0ZXh0YXJlYS52YWx1ZTtcclxuICAgIC8vICAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydCAtIDEpICsgdmFsdWUuc3Vic3RyaW5nKGVuZCk7XHJcbiAgICAvLyAgICAgdGhpcy5uZXdDb21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAvLyAgICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZCA9IHN0YXJ0IC0gMTtcclxuICAgIC8vICAgICB9LCAwKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfVxyXG4gIH1cclxuICBcclxuICBcclxuICBcclxuICB9XHJcblxyXG4iLCI8ZGl2IGNsYXNzPVwiY29tbWVudC1wb3BvdmVyLWNvbnRlbnRcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29tbWVudC1oZWFkZXJcIj5cclxuICAgIDxoNT5BZGQgQ29tbWVudDwvaDU+XHJcbiAgICA8c3BhbiBjbGFzcz1cImNsb3NlLWNvbW1lbnRcIiB0YWJpbmRleD1cIi0xXCIgKGNsaWNrKT1cImNsb3NlQ29tbWVudCgpXCIgKGtleXVwKT1cImNsb3NlQ29tbWVudCgpXCI+eDwvc3Bhbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29tbWVudC1ib3JkZXJcIj48L2Rpdj5cclxuICA8dGV4dGFyZWFcclxuICAgIFsobmdNb2RlbCldPVwibmV3Q29tbWVudFwiXHJcbiAgICByb3dzPVwiNFwiXHJcbiAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgY29tbWVudFwiXHJcbiAgICBjbGFzcz1cImNvbW1lbnQtdGV4dGFyZWFcIlxyXG4gID48L3RleHRhcmVhPlxyXG4gIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwic3VibWl0LWJ1dHRvblwiIChjbGljayk9XCJvblN1Ym1pdCgpXCIgKGtleXVwKT1cIm9uU3VibWl0KClcIj5cclxuICAgICAgU3VibWl0XHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbiJdfQ==