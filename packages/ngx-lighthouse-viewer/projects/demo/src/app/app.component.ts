import { Component, OnInit } from '@angular/core';
import reportJson2 from '../assets/report-v7.5.0.json';
import reportJson1 from '../assets/report-v8.0.0.json';
import reportJson3 from '../assets/report.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo';
  
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
