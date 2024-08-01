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

  navigateToTransferAccount() {
    this.router.navigate(['/transfer-account-form']);
  }

  navigateToReceiptList() {
    this.router.navigate(['/receipt-list']);
  }

  navigateToTransferAccountList() {
    this.router.navigate(['/transfer-account-list']);
  }

  navigateToReceipt() {
    this.router.navigate(['/receipt-form']);
  }

  navigateToPerson() {
    this.router.navigate(['/people-list']);
  }
  navigateToReports() {
    this.router.navigate(["/reports"]);
  }

}