import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { Receipt } from 'src/app/core/models/bazara/bazara-DTOs/receipt';
import { Cheque } from 'src/app/core/models/bazara/bazara-DTOs/cheque';
import { Bank } from 'src/app/core/models/bazara/bazara-DTOs/Bank';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent implements OnInit {
  receiptForm: FormGroup;
  customers: Person[] = [];
  isLoading = false;
  visitorId: any;
  today: string;

  banks: Bank[] = [];
  chequeBanks: string[] = ['بانک ملی', 'بانک ملت', 'بانک صادرات', 'بانک تجارت', 'بانک سپه'];

  constructor(private fb: FormBuilder, private indexedDbService: IndexedDbService, private dialog: MatDialog) {
    this.receiptForm = this.fb.group({
      customerId: [null, Validators.required],
      cashAmount: [0, [Validators.required, Validators.min(0)]],
      cheques: this.fb.array([]),
      remittances: this.fb.array([])
    });

    // Set today's date in YYYY-MM-DD format
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.indexedDbService.getAllData<Person>('Person').then(customers => {
      this.customers = customers;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error getting customers from IndexedDB:', error);
      this.isLoading = false;
    });

    this.visitorId = localStorage.getItem('VisitorId')!;

    // Fetch banks from IndexedDB
    this.indexedDbService.getAllData<Bank>('Bank').then(banks => {
      this.banks = banks;
    }).catch(error => {
      console.error('Error getting banks from IndexedDB:', error);
    });
  }

  get cheques(): FormArray {
    return this.receiptForm.get('cheques') as FormArray;
  }

  get remittances(): FormArray {
    return this.receiptForm.get('remittances') as FormArray;
  }

  addCheque(): void {
    this.cheques.push(this.fb.group({
      date: [this.today, Validators.required],
      bankId: ['', Validators.required], // Use bankId for cheques
      number: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    }));
  }

  removeCheque(index: number): void {
    this.cheques.removeAt(index);
  }

  addRemittance(): void {
    this.remittances.push(this.fb.group({
      date: [this.today, Validators.required],
      bankId: ['', Validators.required], // Use bankId for remittances
      trackingNumber: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    }));
  }

  removeRemittance(index: number): void {
    this.remittances.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    const now = new Date();
    const iranTimeOffset = 3.5;
    const localTime = new Date(now.getTime() + iranTimeOffset * 60 * 60 * 1000);
    const createDate = localTime.toISOString().replace('Z', '');
    const receiptClientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    if (this.receiptForm.valid) {
      const newReceipt: Receipt = {
        ReceiptId: receiptClientId,
        ReceiptClientId: receiptClientId,
        ReceiptCode: 0,
        PersonId: this.receiptForm.value.customerId,
        VisitorId: 0,
        CashAmount: this.receiptForm.value.cashAmount,
        CashCode: 0,
        Description: '',
        Date: createDate,
        TrackingCode: '',
        ProjectId: null,
        OrderId: null,
        Deleted: false,
        DataHash: '',
        CreateDate: createDate,
        UpdateDate: createDate,
        CreateSyncId: 0,
        UpdateSyncId: 0,
        RowVersion: 0,
        PersonClientId: 0,
        PersonCode: 0,
        VisitorClientId: 0,
        VisitorCode: 0,
        OrderClientId: 0,
        OrderCode: 0
      };

      // Map bank IDs for cheques
      const cheques: Cheque[] = this.receiptForm.value.cheques.map((cheque: any) => {
        const bank = this.banks.find(b => b.BankName === cheque.bankId); // Match bankId with BankName
        return {
          ChequeId: this.getClientId(),
          ChequeClientId: this.getClientId(),
          ChequeCode: 0,
          ReceiptId: receiptClientId,
          BankId: bank ? bank.BankId : 0,
          Number: cheque.number,
          BankName: bank ? bank.BankName : '',
          Branch: '',
          Amount: cheque.amount,
          Date: cheque.date,
          Type: 1,
          Description: cheque.description,
          Deleted: false,
          DataHash: '',
          CreateDate: createDate,
          UpdateDate: createDate,
          CreateSyncId: 0,
          UpdateSyncId: 0,
          RowVersion: 0,
          ReceiptClientId: 0,
          ReceiptCode: 0,
          BankClientId: 0,
          BankCode: 0
        };
      });

      // Map bank IDs for remittances
      const remittances: Cheque[] = this.receiptForm.value.remittances.map((remittance: any) => {
        const bank = this.banks.find(b => b.BankId === remittance.bankId);
        return {
          ChequeId: this.getClientId(),
          ChequeClientId: this.getClientId(),
          ChequeCode: 0,
          ReceiptId: receiptClientId,
          BankId: bank ? bank.BankId : 0,
          Number: remittance.trackingNumber,
          BankName: bank ? bank.BankName : '',
          Branch: '',
          Amount: remittance.amount,
          Date: remittance.date,
          Type: 2,
          Description: remittance.description,
          Deleted: false,
          DataHash: '',
          CreateDate: createDate,
          UpdateDate: createDate,
          CreateSyncId: 0,
          UpdateSyncId: 0,
          RowVersion: 0,
          ReceiptClientId: 0,
          ReceiptCode: 0,
          BankClientId: 0,
          BankCode: 0
        };
      });

      try {
        const receipt_key: IDBValidKey = [+this.visitorId, newReceipt.ReceiptClientId];
        const savedReceipt = await this.indexedDbService.addOrEdit('Receipt', newReceipt, receipt_key);
        for (const cheque of cheques) {
          cheque.ReceiptId = savedReceipt.ReceiptId;
          const cheque_key: IDBValidKey = [+this.visitorId, cheque.ChequeClientId];
          await this.indexedDbService.addOrEdit('Cheque', cheque, cheque_key);
        }
        for (const remittance of remittances) {
          remittance.ReceiptId = savedReceipt.ReceiptId;
          const remittance_key: IDBValidKey = [+this.visitorId, remittance.ChequeClientId];
          await this.indexedDbService.addOrEdit('Cheque', remittance, remittance_key);
        }
        console.log('Receipt and related cheques/remittances saved successfully');
      } catch (error) {
        console.error('Error saving receipt and related cheques/remittances:', error);
      }
      console.log(newReceipt, cheques, remittances);
    }
  }

  private getClientId() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}