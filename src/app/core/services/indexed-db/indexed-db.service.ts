import { Injectable } from '@angular/core';
import { IndexedDbManagementService } from './indexedb-management.service';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  constructor(private indexedDbManagementService: IndexedDbManagementService) { }

  getVisitorId(): number {
    return +localStorage.getItem('VisitorId')!;
  }

  setVisitorId(visitorId: string): void {
    localStorage.setItem('VisitorId', visitorId);
  }

  async getAllData<T>(storeName: string): Promise<T[]> {
    await this.indexedDbManagementService.waitForDb();
    const transaction = this.indexedDbManagementService.db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);

    const max_int = Number.MAX_SAFE_INTEGER;
    const keyRange = IDBKeyRange.bound([this.getVisitorId(), 0], [this.getVisitorId(), max_int]);

    return new Promise<T[]>((resolve, reject) => {
      const getRequest = objectStore.getAll(keyRange);
      getRequest.onsuccess = (event: any) => {
        let obj: T[] = (event.target as IDBRequest<T[]>).result;
        resolve(obj);
      };

      getRequest.onerror = (event: any) => {
        reject(new Error('Failed to get data: ' + (event.target as any).error.message));
      };
    });
  }

  async getById<T>(storeName: string, key: number): Promise<T> {
    await this.indexedDbManagementService.waitForDb();
    const transaction = this.indexedDbManagementService.db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);

    const combineKey = [this.getVisitorId(), key];
    return new Promise<T>((resolve, reject) => {
      const getRequest = objectStore.get(combineKey);
      getRequest.onsuccess = (event: any) => {
        let obj: T = (event.target as IDBRequest<T>).result;
        resolve(obj);
      };

      getRequest.onerror = (event: any) => {
        reject(new Error('Failed to get data: ' + (event.target as any).error.message));
      };
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, searchData: string | number): Promise<T[]> {
    this.indexedDbManagementService.waitForDb();
    const transaction = this.indexedDbManagementService.db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index(indexName);

    return new Promise((resolve, reject) => {
      const request = index.getAll(searchData);
      request.onsuccess = function () {
        let cursor = request.result;
        if (cursor != undefined && !cursor.isArray)
          cursor = [cursor];

        console.log(cursor, 'tamam data ha bar asas index birun miad');

        resolve(cursor);
      };

      request.onerror = (event: any) => {
        reject(new Error('Failed to get data: ' + (event.target as any).error.message));
      };
    });
  }

  async getByIndex_multivalue<T>(storeName: string, indexName: string, multiData: number[]): Promise<T[]> {
    let result: T[] = [];
    console.log(multiData, 'che idhaei miad?');

    return new Promise(async (resolve, reject) => {
      await multiData.forEach(async ele => {
        console.log(ele, 'done done miad');

        await this.getByIndex<T>(storeName, indexName, ele).then(async (res: T[]) => {
          result.push(res[0]);
        })
        resolve(result);
      });
    });
  }

  async addOrEdit<T>(storeName: string, data: T, key: IDBValidKey): Promise<T> {
    try {
      await this.indexedDbManagementService.waitForDb();

      const db = await this.indexedDbManagementService.openDatabase(storeName);
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const putRequest = objectStore.put(data, key);
      await new Promise<void>((resolve, reject) => {
        putRequest.onsuccess = (event) => {
          resolve();
        };

        putRequest.onerror = (event) => {
          reject(new Error('Failed to store data: ' + (event.target as any).error.message));
        };
      });
    }
    catch (error) {
      console.log(error);
    }

    return data;
  }

  async insertingToDb<T>(storeName: string, data: T[], key: IDBValidKey) {
    data.forEach(async (element: T) => {
      await this.addOrEdit(storeName, element, key);
    });
  }

  async delete<T>(storeName: string, data: T) {
    await this.indexedDbManagementService.waitForDb();
    await this.indexedDbManagementService.db.put(storeName, data);
  }

  async getMaxRowVersion(storeName: string): Promise<number> {
    const db = await this.indexedDbManagementService.openDatabase(storeName);
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);

    const keyRange = IDBKeyRange.bound([this.getVisitorId(), 0], [this.getVisitorId(), 2147483647]);

    return new Promise<number>((resolve, reject) => {
      const getRequest = objectStore.getAll(keyRange);
      getRequest.onsuccess = (event) => {
        const records = (event.target as IDBRequest<any[]>).result;
        const maxRowVersion = Math.max(...records.map(record => record.RowVersion), 0);
        resolve(maxRowVersion);
      };

      getRequest.onerror = (event) => {
        reject(new Error('Failed to get records: ' + (event.target as any).error.message));
      };
    });
  }
}