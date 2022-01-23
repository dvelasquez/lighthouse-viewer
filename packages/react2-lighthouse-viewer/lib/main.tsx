import React, { useEffect, useState } from 'react';
import { renderReport } from 'lighthouse-viewer';

export type React2LighthouseViewerProps = {
  json: any;
};

export default ({ json }: React2LighthouseViewerProps): JSX.Element => {
  const [template, setTemplate] = useState('');
  useEffect(() => {
    setTemplate(renderReport(json, {}).outerHTML);
  }, [json]);

  return <div dangerouslySetInnerHTML={{ __html: template }} />;
};
