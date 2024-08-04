import { Component, OnInit } from '@angular/core';

import { ProductService } from 'src/app/core/services/pages-services/product.service';
import { ProductListDTO } from 'src/app/core/models/pages/ProductListDTO';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: ProductListDTO[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getProductList();
  }
}