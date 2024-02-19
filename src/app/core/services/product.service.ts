// product.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';

import { IndexedDbService } from './indexed-db.service';
import { ProductsResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://mahakacc.mahaksoft.com/api/v3/sync/getalldata';

  constructor(private http: HttpClient, private indexedDbService: IndexedDbService) {}

  getProducts(): Observable<ProductsResponse> {
    const token = this.indexedDbService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      fromProductVersion: 0
    };

    return this.http.post<ProductsResponse>(this.apiUrl, body, { headers }).pipe(
      tap((response) => {
        if (response.Result) {
          // Successful request
          this.indexedDbService.storeProducts(response.Data.Objects.Products)
            .then(() => console.log('Products data stored in IndexedDB'))
            .catch((error: any) => console.error('Error storing products data:', error));
        } else {
          // Failed request
          console.error('Request error:', response);
        }
      }),
      catchError((error) => {
        console.error('Request error:', error);
        throw error;
      })
    );
  }
}