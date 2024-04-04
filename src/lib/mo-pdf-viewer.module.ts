import { NgModule } from '@angular/core';
import { MoPdfViewerComponent } from './mo-pdf-viewer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MoPdfViewerComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    MoPdfViewerComponent
  ],
  providers: [ provideAnimations() ]
})
export class MoPdfViewerModule {}
