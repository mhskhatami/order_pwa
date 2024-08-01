import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransferAccount } from 'src/app/core/models/bazara/bazara-DTOs/transfer-account';
import { Bank } from 'src/app/core/models/bazara/bazara-DTOs/Bank';
import { Login } from 'src/app/core/models/bazara/bazara-DTOs/Login';

@Component({
  selector: 'app-transfer-account-detail',
  templateUrl: './transfer-account-detail.component.html',
  styleUrls: ['./transfer-account-detail.component.css']
})
export class TransferAccountDetailComponent {
  transferAccount: TransferAccount;
  banks: Bank[];
  users: Login[];

  constructor(
    public dialogRef: MatDialogRef<TransferAccountDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transferAccount = data.transferAccount;
    this.banks = data.banks;
    this.users = data.users;
  }

  getFormattedPersianDate(date: string) {
    // Implement date formatting logic
    return date;
  }

  getTransferType(type: number): string {
    return type === 4 ? 'حواله به هزینه' : 'حواله به بانک';
  }

  getBankName(receiverId: number): string {
    const bank = this.banks.find(b => b.BankId === receiverId);
    return bank ? bank.BankName : '';
  }

  getVisitorName(visitorId: number): string {
    const user = this.users.find(u => u.VisitorId === visitorId);
    return user ? user.UserTitle : '';
  }
}
