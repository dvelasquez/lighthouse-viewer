import { render } from 'react-dom';
import reportJson from './report-v7.0.0.json';
import React2LighthouseViewer from '..';
import React, { FC, useEffect, useState } from 'react';

const reactRootElement = document.getElementById('react-app');
if (reactRootElement) {
  const ReactApp: FC = () => {
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

  render(<ReactApp />, reactRootElement);
}
