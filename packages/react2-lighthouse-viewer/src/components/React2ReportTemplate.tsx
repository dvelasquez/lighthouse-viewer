import React from 'react';
import { template } from 'lighthouse-viewer';

type React2ReportTemplateProps = unknown;

const React2ReportTemplate: React.FC<React2ReportTemplateProps> = (): JSX.Element => (
  <div dangerouslySetInnerHTML={{ __html: template }} />
);

export default React2ReportTemplate;
