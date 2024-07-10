import { UtilService } from '../util.service';
import { MoPdfViewerComponent } from '../mo-pdf-viewer.component';
import * as i0 from "@angular/core";
export declare class TagPopoverComponent {
    utilService: UtilService;
    closePopover: boolean;
    selectedTag: string;
    tagListPrivate: string[];
    tagListPublic: string[];
    selectedTagPublic: boolean;
    selectedTagPrivate: boolean;
    pdfViewer: MoPdfViewerComponent;
    constructor(utilService: UtilService);
    closeTag(): void;
    storeTag(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TagPopoverComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TagPopoverComponent, "mo-app-tag-popover", never, {}, {}, never, never, true, never>;
}
