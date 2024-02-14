// bank-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Bank } from '../../../core/models/Bank';
import { IndexedDbService } from '../../../core/services/indexed-db.service';
import { BanksService } from '../../../core/services/banks.service';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit {
  banks: Bank[] = [];
  isLoading = false; // Add a new property to track loading state

  constructor(private indexedDbService: IndexedDbService, private banksService: BanksService) { }

  ngOnInit(): void {
    this.isLoading = true; // Set loading state to true at the start
    this.indexedDbService.getBanks().then((banks: Bank[]) => {
      if (banks.length > 0) {
        this.banks = banks;
        this.isLoading = false; // Set loading state to false when data is loaded
      } else {
        this.indexedDbService.getLoginToken().then((token: string) => {
          this.banksService.getBanks(token).subscribe((response: { Result: any; Data: { Objects: { Banks: Bank[]; }; }; }) => {
            if (response.Result) {
              this.banks = response.Data.Objects.Banks;
              this.indexedDbService.storeBanks(this.banks).then(() => {
                console.log('Banks data stored in IndexedDB');
                this.isLoading = false; // Set loading state to false when data is loaded
              });
            }
          });
        });
      }
    });
  }
}