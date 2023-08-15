declare module 'lighthouse/dist/report/bundle.esm' {
  import 'lighthouse/report/types/html-renderer.d';
  import type Renderer from 'lighthouse/report/types/report-renderer.d';
  import Result from 'lighthouse/types/lhr/lhr.d';

  export function renderReport(report: Result, opts: Renderer.Options): HTMLElement;
  export { Renderer, Result };
}

declare module 'lighthouse-viewer' {
  import 'lighthouse/report/types/html-renderer.d';
  import type Renderer from 'lighthouse/report/types/report-renderer.d';
  import Result from 'lighthouse/types/lhr/lhr.d';

  export function renderReport(report: Result, opts: Renderer.Options): HTMLElement;
  export { Renderer, Result };
}
