import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLighthouseViewerModule } from '../../../ngx-lighthouse-viewer/src/lib/ngx-lighthouse-viewer.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, NgxLighthouseViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
