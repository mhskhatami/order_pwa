import { Injectable } from '@angular/core';
import { IndexedDbService } from '../indexed-db/indexed-db.service';
import { ProductCategory } from '../../models/bazara/bazara-DTOs/product-category';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  productCategoryList: BehaviorSubject<ProductCategory[]> = new BehaviorSubject<ProductCategory[]>([]);

  constructor(private indexeddbService: IndexedDbService) {
    this.getProductCategoriesList();
  }

  getProductCategoriesList() {
    this.indexeddbService.getAllData<ProductCategory>('ProductCategory').then(async (res) => {
      console.log(res);
      this.productCategoryList.next(res);
    });
    return this.productCategoryList;
  }
}