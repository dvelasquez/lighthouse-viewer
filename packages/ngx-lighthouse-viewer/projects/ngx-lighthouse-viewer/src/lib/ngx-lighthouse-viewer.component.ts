import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { renderReport } from 'lighthouse-viewer';

@Component({
  selector: 'ngx-lighthouse-viewer',
  template: `<div #lighthouseViewerSection class="lighthouse-viewer"></div> `,
  styles: [],
})
export class NgxLighthouseViewerComponent implements AfterViewInit, OnChanges {
  @Input() json: any;

  @ViewChild('lighthouseViewerSection') lighthouseViewerSection!: ElementRef<HTMLDivElement>;

  private _viewInit = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.generateReport();
  }

  ngAfterViewInit(): void {
    this._viewInit = true;
    this.generateReport();
  }

  generateReport() {
    if (!this._viewInit || !this.json) {
      return;
    }

    this.lighthouseViewerSection.nativeElement.appendChild(renderReport(this.json));
  }
}
