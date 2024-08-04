import { Component, OnInit } from '@angular/core';
import * as moment from 'jalali-moment';
import { Login } from 'src/app/core/models/bazara/bazara-DTOs/Login';
import { Bank } from 'src/app/core/models/bazara/bazara-DTOs/Bank';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { MatDialog } from '@angular/material/dialog';
//import { TransferAccountDetailComponent } from '../transfer-account-detail/transfer-account-detail.component';
import { TransferAccount } from 'src/app/core/models/bazara/bazara-DTOs/transfer-account';
import { TransferAccountDetailComponent } from '../transfer-account-detail/transfer-account-detail.component';

@Component({
  selector: 'app-transfer-account-list',
  templateUrl: './transfer-account-list.component.html',
  styleUrls: ['./transfer-account-list.component.css']
})
export class TransferAccountListComponent implements OnInit {
  
  
  transferAccounts: TransferAccount[] = [];
  users: Login[] = [];
  //users: any;
  banks: Bank[] = [];
  isLoading = false;

  searchText = '';

  get filteredTransferAccounts() {
   return this.transferAccounts.filter(account =>
      this.getVisitorName(account.VisitorId).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  constructor(private indexedDbService: IndexedDbService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    Promise.all([
      this.indexedDbService.getAllData<TransferAccount>("TransferAccount"),
      this.indexedDbService.getAllData<Login>("Login"),
      this.indexedDbService.getAllData<Bank>("Bank")
    ]).then(([transferAccounts, users, banks]) => {
      this.transferAccounts = transferAccounts.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
      this.users = users;
      console.log(users);
      
      this.banks = banks;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error getting data from IndexedDB:', error);
      // Handle the error appropriately
    });
  }

  // openTransferAccountDetail(transferAccount: TransferAccount) {
  //   this.dialog.open(TransferAccountDetailComponent, {
  //     width: '600px',
  //     data: {
  //       transferAccount: transferAccount,
  //       banks: this.banks,
  //       users: this.users
  //     }
  //   });
  // }

  getVisitorName(visitorId: number): string {
    console.log('Visitor ID to find:', visitorId);
    console.log('Users array:', this.users);
    console.log('User:', this.users.filter(x => {return x.VisitorId == 31434}));
  
    const user = this.users.find(u => u.VisitorId === visitorId);
  
    if (!user) {
      console.log(`No user found with VisitorId: ${visitorId}`);
      return '';
    }
  
    console.log('Found user:', user);
    return user.UserTitle;
  }
  

  getBankName(receiverId: number): string {
    const bank = this.banks.find(b => b.BankId === receiverId);
    return bank ? bank.BankName : '';
  }

  getTransferType(type: number): string {
    return type === 4 ? 'حواله به هزینه' : 'حواله به بانک';
  }

  getFormattedPersianDate(dateString: string): string {
    let m = moment(dateString, 'YYYY-M-D HH:mm:ss');
    let persianDate = m.format('jYYYY/jM/jD HH:mm:ss');
    return persianDate;
  }

  openTransferAccountDetail(transferAccount: TransferAccount) {
    this.dialog.open(TransferAccountDetailComponent, {
      width: '600px',
      data: {
        transferAccount: transferAccount,
        banks: this.banks,
        users: this.users
      }
    });
  }
}