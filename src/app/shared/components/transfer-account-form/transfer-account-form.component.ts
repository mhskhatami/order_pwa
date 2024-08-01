import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { Bank } from 'src/app/core/models/bazara/bazara-DTOs/Bank';
import { TransferAccount } from 'src/app/core/models/bazara/bazara-DTOs/transfer-account';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transfer-account-form',
  templateUrl: './transfer-account-form.component.html',
  styleUrls: ['./transfer-account-form.component.css']
})
export class TransferAccountFormComponent implements OnInit {
  transferAccountForm: FormGroup;
  isLoading = false;
  visitorId: any;
  today: string;
  banks: Bank[] = [];
  transferTypes = [
    { id: 3, name: 'حواله به بانک' },
    { id: 4, name: 'حواله به هزینه' }
  ];

  constructor(
    private fb: FormBuilder,
    private indexedDbService: IndexedDbService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Set today's date in YYYY-MM-DD format
    this.today = new Date().toISOString().split('T')[0];

    this.transferAccountForm = this.fb.group({
      type: [null, Validators.required],
      receiverId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      date: [this.today, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.visitorId = localStorage.getItem('VisitorId')!;

    this.indexedDbService.getAllData<Bank>('Bank').then((banks: Bank[]) => {
      this.banks = banks;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error getting banks from IndexedDB:', error);
      this.isLoading = false;
    });
  }

  async onSubmit(): Promise<void> {
    const now = new Date();
    const iranTimeOffset = 3.5;
    const localTime = new Date(now.getTime() + iranTimeOffset * 60 * 60 * 1000);
    const createDate = localTime.toISOString().replace('Z', '');
    const transferAccountClientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    if (this.transferAccountForm.valid) {
      const newTransferAccount: TransferAccount = {
        TransferAccountId: transferAccountClientId,
        TransferAccountClientId: transferAccountClientId,
        TransferAccountCode: 0,
        Date: this.transferAccountForm.value.date,
        Type: this.transferAccountForm.value.type,
        ReceiverId: this.transferAccountForm.value.receiverId,
        PayerType: 0,
        PayerId: 0,
        Price: this.transferAccountForm.value.price,
        VisitorId: +this.visitorId,
        Description: this.transferAccountForm.value.description,
        Deleted: false,
        DataHash: '',
        CreateDate: createDate,
        UpdateDate: createDate,
        CreateSyncId: 0,
        UpdateSyncId: 0,
        RowVersion: 0,
        VisitorClientId: 0,
        VisitorCode: 0
      };

      try {
        const transferAccount_key: IDBValidKey = [+this.visitorId, newTransferAccount.TransferAccountClientId];
        await this.indexedDbService.addOrEdit('TransferAccount', newTransferAccount, transferAccount_key);

        console.log('Transfer Account saved successfully');
        this.resetForm();
        this.snackBar.open('حواله با موفقیت ثبت شد', 'بستن', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      } catch (error) {
        console.error('Error saving transfer account:', error);
        this.snackBar.open('خطا در ثبت حواله', 'بستن', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }
  }

  resetForm(): void {
    this.transferAccountForm.reset({
      type: null,
      receiverId: null,
      price: 0,
      date: this.today,
      description: ''
    });
  }
}
