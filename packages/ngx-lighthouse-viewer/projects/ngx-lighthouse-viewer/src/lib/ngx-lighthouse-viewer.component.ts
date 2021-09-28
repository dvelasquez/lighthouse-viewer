import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOM, Logger, ReportRenderer, ReportUIFeatures, template } from 'lighthouse-viewer';

@Component({
  selector: 'ngx-lighthouse-viewer',
  template: `
    <div class="lh-root lh-vars">
      <div [innerHTML]="template"></div>
      <main class="ngx-lighthouse-viewer"></main>
      <div id="lh-log"></div>
    </div>
  `,
  styles: [],
})
export class NgxLighthouseViewerComponent implements AfterViewInit, OnChanges {
  @Input() json: any;

  template;

  private _viewInit: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.template = template;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateReport();
  }

  ngAfterViewInit(): void {
    this._viewInit = true;
    this.lhLogEventListener();
    this.generateReport();
  }

  lhLogEventListener = () => {
    this.document.addEventListener('lh-log', (e: CustomEventInit) => {
      const logger = new Logger(this.document.querySelector('#lh-log'));
      switch (e.detail.cmd) {
        case 'log':
          logger.log(e.detail.msg);
          break;
        case 'warn':
          logger.warn(e.detail.msg);
          break;
        case 'error':
          logger.error(e.detail.msg);
          break;
        case 'hide':
          logger.hide();
          break;
        default:
      }
    });
  };

  generateReport() {
    if (!this._viewInit || !this.json) {
      return;
    }

    const dom = new DOM(this.document);
    const renderer = new ReportRenderer(dom);

    const container = this.document.querySelector('main.ngx-lighthouse-viewer');

    renderer.renderReport(this.json, container);

    const features = new ReportUIFeatures(dom);
    features.initFeatures(this.json);
  }
}
