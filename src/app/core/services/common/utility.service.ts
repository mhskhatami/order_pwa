import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { StoreNameModel } from '../../models/indexed-db/StoreNameModel';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  showHeaderFooter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  updateExist: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  storeNameList: BehaviorSubject<StoreNameModel[]> = new BehaviorSubject<StoreNameModel[]>([]);
  url: string = '/assets/storename.json';

  constructor(private httpClient: HttpClient) {
    this.getStoreNamesList();
  }

  getStoreNamesList() {
    this.httpClient.get<StoreNameModel[]>(this.url).subscribe((res: StoreNameModel[]) => {
      this.storeNameList.next(res);
    });
  }}