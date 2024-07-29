import { Component, OnInit } from '@angular/core';
import * as moment from 'jalali-moment';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { Receipt } from 'src/app/core/models/bazara/bazara-DTOs/receipt';
import { Cheque } from 'src/app/core/models/bazara/bazara-DTOs/cheque';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css']
})
export class ReceiptListComponent implements OnInit {
  receipts: Receipt[] = [];
  cheques: Cheque[] = [];
  people: Person[] = [];
  isLoading = false;

  searchText = '';

  get filteredReceipts() {
    return this.receipts.filter(receipt =>
      this.getPersonName(receipt.PersonId).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.isLoading = true;
    Promise.all([
      this.indexedDbService.getAllData<Receipt>("Receipt"),
      this.indexedDbService.getAllData<Cheque>("Cheque"),
      this.indexedDbService.getAllData<Person>("Person")
    ]).then(([receipts, cheques, people]) => {
      this.receipts = receipts.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
      this.cheques = cheques;
      this.people = people;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error getting data from IndexedDB:', error);
      // Handle the error appropriately (e.g., display a user-friendly message)
    });
  }

  getTotalAmount(receipt: Receipt): number {
    const totalChecks = this.getTotalChecks(receipt.ReceiptId);
    const totalRemittances = this.getTotalRemittances(receipt.ReceiptId);
    return receipt.CashAmount + totalChecks + totalRemittances;
  }

  getTotalChecks(receiptId: number): number {
    const relatedCheques = this.cheques.filter(cheque => cheque.ReceiptId === receiptId && cheque.Type === 1);
    return relatedCheques.reduce((sum, cheque) => sum + cheque.Amount, 0);
  }

  getTotalRemittances(receiptId: number): number {
    const relatedCheques = this.cheques.filter(cheque => cheque.ReceiptId === receiptId && cheque.Type === 2);
    return relatedCheques.reduce((sum, cheque) => sum + cheque.Amount, 0);
  }

  getPersonName(personId: number): string {
    const person = this.people.find(p => p.PersonId === personId);
    if (person) {
      const firstName = person.FirstName || ''; // Handle null or undefined FirstName
      const lastName = person.LastName || ''; // Handle null or undefined LastName
      return firstName + ' ' + lastName;
    }
    return ''; // Return empty string if person is null or undefined
  }

  getPerson(personId: number): Person | undefined {
    return this.people.find(p => p.PersonId === personId);
  }

  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  getFormattedPersianDate(dateString: string): string {
    let m = moment(dateString, 'YYYY-M-D HH:mm:ss');
    let persianDate = m.format('jYYYY/jM/jD HH:mm:ss');
    return persianDate;
  }
}
