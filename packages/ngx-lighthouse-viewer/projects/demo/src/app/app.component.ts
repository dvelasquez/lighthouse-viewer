import { Component, OnInit } from '@angular/core';
import reportJson2 from '../assets/report-v7.5.0.json';
import reportJson1 from '../assets/report-v8.0.0.json';
import reportJson3 from '../assets/report.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Lighthouse Viewer / Reporter Angular';

  data: any;

  private _reports: any[] = [];

  ngOnInit() {
    this._reports = [reportJson1, reportJson2, reportJson3];
    this.data = this._reports[0];
  }

  renderReport(index: number) {
    this.data = this._reports[index];
  }
}
