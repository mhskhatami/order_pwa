import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cheque } from 'src/app/core/models/bazara/bazara-DTOs/cheque';
import { Receipt } from 'src/app/core/models/bazara/bazara-DTOs/receipt';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.css']
})
export class ReceiptDetailComponent {
  receipt: Receipt;

  constructor(
    public dialogRef: MatDialogRef<ReceiptDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.receipt = data.receipt;
  }

  getCheques(receiptId: number) {
    return this.data.cheques.filter((cheque: Cheque) => cheque.ReceiptId === receiptId && cheque.Type === 1);
  }

  getRemittances(receiptId: number) {
    return this.data.cheques.filter((cheque: Cheque) => cheque.ReceiptId === receiptId && cheque.Type === 2);
  }

  getFormattedPersianDate(date: string) {
    // Implement date formatting logic
    return date;
  }

  getTotalChecks(receiptId: number) {
    return this.getCheques(receiptId).reduce((sum: number, cheque: any) => sum + cheque.Amount, 0);
  }

  getTotalRemittances(receiptId: number) {
    return this.getRemittances(receiptId).reduce((sum: number, remittance: any) => sum + remittance.Amount, 0);
  }

  getTotalAmount(receipt: any) {
    const totalChecks = this.getTotalChecks(receipt.ReceiptId);
    const totalRemittances = this.getTotalRemittances(receipt.ReceiptId);
    return receipt.CashAmount + totalChecks + totalRemittances;
  }
}
