import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { ProductCategory } from 'src/app/core/models/bazara/bazara-DTOs/product-category';
import { CategorySelected } from 'src/app/core/models/pages/CategorySelected';
import { ProductCategoryService } from 'src/app/core/services/pages-services/product-category.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  chipsSelected: CategorySelected[] = [];

  constructor(private productCategoryService: ProductCategoryService, private bottomSheetRef: MatBottomSheetRef<ProductCategoryComponent>) { }

  ngOnInit(): void {
    this.getProductCategories();
  }

  getProductCategories(): void {
    this.productCategoryService.productCategoryList.subscribe(categoryList => {
      this.productCategories = categoryList;
    });
  }

  closeBottomSheet() {    
    this.bottomSheetRef.dismiss(this.chipsSelected);
  }

  categorySelection(categoryId: number, event: any) {
    let temp: CategorySelected = { id: 0, isSelected: false };
    if (!this.chipsSelected.find(x => x.id == categoryId)) {
      temp.id = categoryId;
      temp.isSelected = true;

      this.chipsSelected.push(temp);
    }
    else {
      this.chipsSelected = this.chipsSelected.filter(obj => obj.id != +categoryId);
    }
  }
}