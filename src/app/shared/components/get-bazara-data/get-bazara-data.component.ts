import { Component, OnInit } from '@angular/core';

import { IndexedDbService } from '../../../core/services/indexed-db/indexed-db.service';
import { IGetBazaraData } from '../../../core/models/bazara/get-all-data-DTOs/IGetBazaraData';
import { BazaraService } from '../../../core/services/bazara/bazara.service';
import { IApiResult } from '../../../core/models/bazara/get-all-data-DTOs/IApiResult';
import { UtilityService } from 'src/app/core/services/common/utility.service';

@Component({
  selector: 'app-get-bazara-data',
  standalone: true,
  imports: [],
  templateUrl: './get-bazara-data.component.html',
  styleUrls: ['./get-bazara-data.component.css']
})
export class GetBazaraDataComponent implements OnInit {

  terminate: boolean = false;
  dataStatus: { [key: string]: boolean } = {};
  dataCounts: { [key: string]: number } = {};
  maxRowVersionModel: IGetBazaraData = {};
  visitorId = localStorage.getItem('VisitorId')!;

  constructor(private indexedDbService: IndexedDbService, private bazaraService: BazaraService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.fetchAllData();
  }

  private async fetchAllData() {
    try {
      this.utilityService.storeNameList.subscribe(res => {
        res.forEach(async store => {
          const property = `from${store.storeName}Version` as keyof IGetBazaraData;
          this.maxRowVersionModel[property] = await this.indexedDbService.getMaxRowVersion(store.storeName);

          this.bazaraService.getBazaraData(this.maxRowVersionModel!).subscribe({
            next: (res: IApiResult) => {
              if (res.Result) {
                this.handleReceivedData(res.Data.Objects);
              }
            },
            error: (err) => {
              console.log(err);
            }
          });
        });
        
      });  
    } catch (error) {
      console.error('Error fetching data:', error);
      this.terminate = true;
    }
  }

  private handleReceivedData(dataObjects: any) {
    const dataMapping = {
      People: ['Person', 'peopleReceived'],
      VisitorPeople: ['VisitorPerson', 'visitorPeopleReceived'],
      ProductCategories: ['ProductCategory', 'productCategoriesReceived'],
      PersonAddresses: ['PersonAddress', 'personAddressesReceived'],
      Products: ['Product', 'productsReceived'],
      VisitorProducts: ['VisitorProduct', 'visitorProductsReceived'],
      ProductDetails: ['ProductDetail', 'productDetailsReceived'],
      PhotoGalleries: ['PhotoGallery', 'photoGalleriesReceived'],
      Pictures: ['Picture', 'picturesReceived'],
      ProductDetailStoreAssets: ['ProductDetailStoreAsset', 'productDetailStoreAssetsReceived'],
      Banks: ['Bank', 'banksReceived'],
      Missions: ['Mission', 'missionsReceived'],
      MissionDetails: ['MissionDetail', 'missionDetailsReceived'],
      Orders: ['Order', 'ordersReceived'],
      OrderDetails: ['OrderDetail', 'orderDetailsReceived'],
      PropertyDescriptions: ['PropertyDescription', 'propertyDescriptionsReceived'],
      Settings: ['Setting', 'settingReceived'],
      ExtraDatas: ['ExtraData', 'extraDataReceived'],
      Promotions: ['Promotion', 'promotionReceived'],
      PromotionDetails: ['PromotionDetail', 'promotionDetailReceived'],
      PromotionEntities: ['PromotionEntity', 'promotionEntityReceived'],
      Receipts: ['Receipt', 'receiptReceived'],
      Cheques: ['Cheque', 'chequeReceived'],
      TransferAccounts: ['TransferAccount', 'transferAccountReceived']
    };

    for (const [key, [storeName, statusKey]] of Object.entries(dataMapping)) {
      this.handleData(dataObjects[key], storeName, statusKey);
    }
  }

  private handleData(dataArray: any[], storeName: string, statusKey: string) {
    if (dataArray && dataArray.length > 0) {
      this.dataCounts[statusKey] = dataArray.length;
      dataArray.forEach(ele => {
        const key: IDBValidKey = [+this.visitorId, ele[`${storeName}Id`]];
        this.indexedDbService.addOrEdit(storeName, ele, key)
          .then(() => {
            this.dataStatus[statusKey] = true;
          })
          .catch((error) => {
            console.error('Error adding data to IndexedDB:', error);
          });
      });
    }
  }
}