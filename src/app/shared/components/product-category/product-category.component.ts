import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { ProductCategory } from 'src/app/core/models/bazara/bazara-DTOs/product-category';
import { ProductCategoryService } from 'src/app/core/services/pages-services/product-category.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  chipsSelected: number[] = [];

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
    if (!this.chipsSelected.includes(categoryId)) {
      this.chipsSelected.push(categoryId);
    }
    else {
      const index = this.chipsSelected.indexOf(categoryId)
      this.chipsSelected.splice(index, 1);
    }
  }
}