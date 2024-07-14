import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mini-report',
  templateUrl: './mini-report.component.html',
  styleUrls: ['./mini-report.component.css']
})
export class MiniReportComponent implements OnInit {
  date!: string;

  ngOnInit() {
    // Example date in the format 'YYYY-M-D HH:mm:ss'
    this.date = new Date().toISOString(); // Adjust date format as needed
  }
}
