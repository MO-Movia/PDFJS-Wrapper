import { NgModule } from '@angular/core';
import { MoPdfViewerComponent } from './mo-pdf-viewer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MoPdfViewerComponent
  ],
  imports: [
    PdfViewerModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  exports: [
    MoPdfViewerComponent
  ]
})
export class MoPdfViewerModule {}
