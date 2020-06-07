import React, { useEffect } from 'react';
import React2ReportTemplate from './React2ReportTemplate';
import { generateReport, lhLogEventListener } from '../helpers/lighthouse-methods';

export type React2LighthouseViewerProps = {
  json: any;
};

export default (props: React2LighthouseViewerProps): JSX.Element => {
  useEffect(() => {
    lhLogEventListener();
    generateReport(props.json);
  });

  return (
    <div className="lh-root lh-vars">
      <React2ReportTemplate />
      <main className="react2-lighthouse-viewer">{/* report populated here */}</main>
      <div id="lh-log" />
    </div>
  );
};
