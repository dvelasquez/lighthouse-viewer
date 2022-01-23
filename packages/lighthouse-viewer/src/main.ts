import './style.css'
import { renderReport } from '../lib/main'
import report from './static/report.json'

const app = document.querySelector<HTMLDivElement>('#lighthouse-viewer-element')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
const reportHtml = renderReport(report as any, {})
app.appendChild(reportHtml)