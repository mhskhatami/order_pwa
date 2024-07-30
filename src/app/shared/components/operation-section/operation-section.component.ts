import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operation-section',
  templateUrl: './operation-section.component.html',
  styleUrl: './operation-section.component.css'
})
export class OperationSectionComponent {


  constructor(private router: Router) { }

  navigateToInvoice() {
    this.router.navigate(['/invoice']);
  }

  navigateToReceipt() {
    this.router.navigate(['/receipt-list']);
  }

  navigateToPerson() {
    this.router.navigate(['/people-list']);
  }
  navigateToReports() {
    this.router.navigate(["/reports"]);
  }

}