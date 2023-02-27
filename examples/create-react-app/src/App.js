import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import React2LighthouseViewer from 'react2-lighthouse-viewer';

function App() {
  const [json, setJson] = useState(null);
  useEffect(() => {
    fetch('./report.json')
      .then((res) => res.json())
      .then((json) => setJson(json));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img width="300px" src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        <h1>Lighthouse Viewer + Create React APP (CRA)</h1>
        <section>{json && json.userAgent ? <React2LighthouseViewer json={json} /> : 'No data loaded'}</section>
      </main>
    </div>
  );
}

export default App;
