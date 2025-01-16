import 'lighthouse/report/types/html-renderer.d';
import type Renderer from 'lighthouse/report/types/report-renderer.d';
import type Result from 'lighthouse/types/lhr/lhr.d';

import { renderReport as renderLighthouseReport } from 'lighthouse/dist/report/bundle.esm';

function renderReport(report: Result, opts: Renderer.Options): HTMLElement {
  return renderLighthouseReport(report, opts);
}

export { renderReport, Result };
