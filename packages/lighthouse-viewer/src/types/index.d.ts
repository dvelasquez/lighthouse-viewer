declare module 'lighthouse-viewer' {
  import ReportResult from 'lighthouse/report/types/report-result.d';
  export function renderReport(json: ReportResult): HTMLElement;
}
