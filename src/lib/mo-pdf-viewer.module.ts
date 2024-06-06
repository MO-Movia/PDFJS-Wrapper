import { NgModule } from '@angular/core';
import { MoPdfViewerComponent } from './mo-pdf-viewer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import { NgbNavModule, NgbTooltipModule, NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [MoPdfViewerComponent],
  imports: [
    CommonModule,
    PdfViewerModule,
    FontAwesomeModule,
    FormsModule,
    AngularSplitModule,
    NgbNavModule,
    NgbTooltipModule,
    NgxExtendedPdfViewerModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  exports: [MoPdfViewerComponent],
  providers: [provideAnimations()],
})
export class MoPdfViewerModule {}
