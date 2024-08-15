import { Component, HostListener, OnInit } from '@angular/core';

import { ProductService } from 'src/app/core/services/pages-services/product.service';
import { ProductListDTO } from 'src/app/core/models/pages/ProductListDTO';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductCategoryComponent } from '../product-category/product-category.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: ProductListDTO[] = [];
  manualHeight!: number;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.measureHeight();
  }

  measureHeight() {
    this.manualHeight = window.innerHeight - 128;
  }

  constructor(private productService: ProductService, private bottomSheet: MatBottomSheet) {
    this.measureHeight();
  }

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.products = this.productService.getProductList();
  }

  openBottomSheet(): void {
    this.products = this.productService.getProductList();
    let temp: ProductListDTO[] = [];
    const bottomSheetRef = this.bottomSheet.open(ProductCategoryComponent);

    bottomSheetRef.afterDismissed().subscribe((res) => {
      if (res.length != 0) {
        for (let i = 0; i < res.length; i++) {
          temp.push(...this.products.filter(p => p.ProductCategoryId == res[i]));
        }
        this.products = temp;
      }
    });
  }
}