import React, { useEffect, useState } from 'react';
import { renderReport, Result } from 'lighthouse-viewer';

export type React2LighthouseViewerProps = {
  json: Result;
};

export type { Result };

export default ({ json }: React2LighthouseViewerProps): React.JSX.Element => {
  const [template, setTemplate] = useState('');
  useEffect(() => {
    setTemplate(renderReport(json, {}).outerHTML);
  }, [json]);

  return <div dangerouslySetInnerHTML={{ __html: template }} />;
};
