import { Injectable } from '@angular/core';
import { StoreNameModel } from '../../../core/models/indexed-db/StoreNameModel';
import { UtilityService } from '../common/utility.service';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbManagementService {

  db: any;
  private dbVersion = 25;
  private dbName = 'MobileOrderingDb';
  StoreNameList: StoreNameModel[] = [];

  constructor(private utilityService: UtilityService) {
    this.getStoreNamesList();
    this.openDatabase();    
  }
  
  getStoreNamesList() {
    this.utilityService.storeNameList.subscribe(res =>{
      this.StoreNameList = res;
    });
  }

  async openDatabase(storeName?: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBRequest<IDBDatabase>).result;
        this.StoreNameList.forEach((store: StoreNameModel) => {
          if (!this.db.objectStoreNames.contains(store.storeName)) {
            const creation = this.db.createObjectStore(store.storeName);

            if (store.indexes) {
              store.indexes.forEach(storeIndex => {
                creation.createIndex(storeIndex.indexName, storeIndex.indexValue, { unique: false })
              });
            }
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBRequest<IDBDatabase>).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(new Error('Failed to open database: ' + (event.target as any).error.message));
      };
    });
  }

  async waitForDb() {
    if (!this.db)
      this.db = await this.openDatabase();
  }
}