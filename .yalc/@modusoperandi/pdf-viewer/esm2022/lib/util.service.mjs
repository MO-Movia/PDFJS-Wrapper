import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class UtilService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi91dGlsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFjM0MsTUFBTSxPQUFPLFdBQVc7SUFNZixvQkFBb0IsQ0FBQyxVQUFrQjtRQUM1QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0saUJBQWlCO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBRU0sbUJBQW1CLENBQUMsU0FBaUI7UUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUVNLG1CQUFtQixDQUFDLFVBQWU7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxPQUFnQjtRQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNNLG9CQUFvQixDQUFDLFNBQW1CO1FBQzdDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRDtRQXZDTyxtQkFBYyxHQUFhLEVBQUUsQ0FBQztRQUM5QixrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUM3QixnQkFBVyxHQUFjLEVBQUUsQ0FBQztRQUM1QixrQkFBYSxHQUFVLEVBQUUsQ0FBQztJQW9DbEIsQ0FBQzsrR0F4Q0wsV0FBVzttSEFBWCxXQUFXLGNBRlYsTUFBTTs7NEZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1lbnRTZWxlY3Rpb24gfSBmcm9tICcuL21vZGVscy9jb21tZW50LXNlbGVjdGlvbi5tb2RlbCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnQgZXh0ZW5kcyBDb21tZW50U2VsZWN0aW9uIHtcclxuICB0ZXh0OiBzdHJpbmc7XHJcbiAgY29tbWVudDogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSGlnaGxpZ2h0IHtcclxuICB0ZXh0OiBzdHJpbmc7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVdGlsU2VydmljZSB7XHJcbiAgcHVibGljIHRhZ0xpc3RQcml2YXRlOiBzdHJpbmdbXSA9IFtdO1xyXG4gIHB1YmxpYyB0YWdMaXN0UHVibGljOiBzdHJpbmdbXSA9IFtdO1xyXG4gIHB1YmxpYyBjb21tZW50TGlzdDogQ29tbWVudFtdID0gW107XHJcbiAgcHVibGljIGhpZ2hsaWdodExpc3Q6IGFueVtdID0gW107XHJcblxyXG4gIHB1YmxpYyB1cGRhdGVUYWdMaXN0UHJpdmF0ZSh0YWdQcml2YXRlOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgdGhpcy50YWdMaXN0UHJpdmF0ZS5wdXNoKHRhZ1ByaXZhdGUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFRhZ0xpc3RQcml2YXRlKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLnRhZ0xpc3RQcml2YXRlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZVRhZ0xpc3RQdWJsaWModGFnUHVibGljOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgdGhpcy50YWdMaXN0UHVibGljLnB1c2godGFnUHVibGljKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUYWdMaXN0UHVibGljKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0aGlzLnRhZ0xpc3RQdWJsaWM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlSGlnaGxpZ2h0TGlzdChoaWdodGxpZ2h0OiBhbnkpIHtcclxuICAgIHRoaXMuaGlnaGxpZ2h0TGlzdC5wdXNoKGhpZ2h0bGlnaHQpO1xyXG4gIH1cclxuICBwdWJsaWMgZ2V0aGlnaGxpZ2h0VGV4dCgpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRMaXN0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUNvbW1lbnRzKGNvbW1lbnQ6IENvbW1lbnQpOnZvaWQge1xyXG4gICAgdGhpcy5jb21tZW50TGlzdC5wdXNoKGNvbW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldENvbW1lbnRMaXN0KCk6IENvbW1lbnRbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb21tZW50TGlzdDtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZWRIaWdobGlnaHRMaXN0KGhpZ2hsaWdodDogc3RyaW5nW10pIHtcclxuICAgIHRoaXMuaGlnaGxpZ2h0TGlzdCA9IGhpZ2hsaWdodC5zbGljZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG59XHJcbiJdfQ==