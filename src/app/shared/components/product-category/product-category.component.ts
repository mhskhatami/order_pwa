import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory } from 'src/app/core/models/bazara/bazara-DTOs/product-category';
import { ProductCategoryService } from 'src/app/core/services/pages-services/product-category.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productCategoryService: ProductCategoryService, private router: Router) { }

  ngOnInit(): void {
    this.getProductCategories();
  }

  getProductCategories(): void {
    this.productCategoryService.productCategoryList.subscribe(categories => {
      this.productCategories = categories;
    });
  }

  closeBottomSheet() {

  }

  chipSelected(category: ProductCategory) {
    console.log(category);

  }
}
