declare module 'lighthouse/dist/report/bundle.esm' {
    import type Renderer from 'lighthouse/report/types/report-renderer.d';
    import type {Result as AuditResult} from 'lighthouse/types/lhr/audit-result.d';

    export function renderReport(report: AuditResult, opts: Renderer.Options): HTMLElement;
}