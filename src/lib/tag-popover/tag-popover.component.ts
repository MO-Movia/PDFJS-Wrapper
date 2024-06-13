import { Component, ElementRef, HostListener, Renderer2, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-tag-popover',
  templateUrl: './tag-popover.component.html',
  styleUrls: ['./tag-popover.component.scss'],
  standalone: true,
  imports: [FormsModule],
})

export class TagPopoverComponent {

  @ViewChild(NgxExtendedPdfViewerComponent)
  public pdfComponent!: NgxExtendedPdfViewerComponent;
  public closePopover:boolean = false;
  public selectedTag:string = '';
  public tagList:string[] = [];   

  public closeTag(): void {
    const popover = document.querySelector('.tag-popover') as HTMLElement;
    if(!this.closePopover){
    popover.style.display = 'none';
    }
    this.closePopover = !this.closePopover;
  }

  public storeTag():void{
    if (this.selectedTag) {
      this.tagList.push(this.selectedTag);
      console.log(this.tagList); 
      this.closeTag();
    }
  }

}
