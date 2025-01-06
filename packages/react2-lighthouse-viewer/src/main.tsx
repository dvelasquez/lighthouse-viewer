import { createRoot } from 'react-dom/client';
import reportJson from './assets/report.json';
import React2LighthouseViewer from '../lib/main';
import React, { FC, useEffect, useState } from 'react';

const reactRootElement = document.getElementById('react-app');
if (reactRootElement) {
  const ReactApp: FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const report: any = {};
    const [data, setData] = useState(report);

    useEffect(() => {
      setData(reportJson);
    }, []);

    return (
      <div>
        <h1>REACT APP</h1>
        {data && data.userAgent && <React2LighthouseViewer json={data} />}
      </div>
    );
  };
  const root = createRoot(reactRootElement);
  root.render(<ReactApp />);
}
