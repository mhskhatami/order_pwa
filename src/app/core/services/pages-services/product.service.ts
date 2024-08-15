import { Injectable } from '@angular/core';

import { ProductListDTO } from '../../models/pages/ProductListDTO';
import { IndexedDbService } from '../indexed-db/indexed-db.service';
import { Product } from '../../models/bazara/bazara-DTOs/product';
import { ProductDetail } from '../../models/bazara/bazara-DTOs/productDetail';
import { VisitorProduct } from '../../models/bazara/bazara-DTOs/visitorProduct';
import { ProductDetailStoreAsset } from '../../models/bazara/bazara-DTOs/productDetailAssetStore';
import { Picture } from '../../models/bazara/bazara-DTOs/picture';
import { PhotoGallery } from '../../models/bazara/bazara-DTOs/PhotoGallery';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList: ProductListDTO[] = [];

  constructor(private indexedService: IndexedDbService) { }

  getProductList() {
    this.productList = [];

    this.indexedService.getAllData<Product>('Product').then(async (products) => {
      products.forEach(async (product) => {
        let temp: ProductListDTO = { ProductId: 0, ProductDetailId: 0, Deleted: false, ProductName: '', Price: 0, Count1: 0, Count2: 0, Quantity: 0, PicUrl: '', VisitorDeleted: false, VisitorId: 0, Name: '', ProductCode: 0, UnitName: '', UnitName2: '' };
        if (!product.Deleted) {
          const productDetail: ProductDetail = await this.getRelatedProductDetails(product.ProductId).then();
          const visitorProduct: VisitorProduct = await this.getRelatedVisitorProduct(productDetail.ProductDetailId);
          const photoGallery: PhotoGallery = await this.getRelatedPhotoGalley(product.ProductId);
          const productDetailAssetsStore: ProductDetailStoreAsset = await this.getRelatedProductDetailStoreAsset(productDetail.ProductDetailId);

          if (!visitorProduct.Deleted) {
            temp.ProductId = product.ProductId;
            temp.ProductDetailId = productDetail.ProductDetailId;
            temp.VisitorId = productDetail.VisitorId;
            temp.VisitorDeleted = visitorProduct.Deleted;
            temp.Price = parseFloat((productDetail as any)['Price' + productDetail?.DefaultSellPriceLevel]);
            temp.Count1 = productDetailAssetsStore.Count1;
            temp.Count2 = productDetailAssetsStore.Count2;
            temp.UnitName = product.UnitName;
            temp.UnitName2 = product.UnitName2;
            temp.Name = product.Name;
            temp.ProductCode = product.ProductCode;

            if (photoGallery != undefined && Object.keys(photoGallery).length != 0) {
              const picture: Picture = await this.getRelatedPicture(photoGallery.PictureId);
         
              if (picture != undefined && Object.keys(picture).length != 0)
                temp.PicUrl = `https://mahakacc.mahaksoft.com${picture.Url}`;
            }
            else {
              temp.PicUrl = 'assets/img_empty_product.png';
            }
          }
        }

        if (temp.ProductId != 0)
          this.productList.push(temp);
      });
    });

    return this.productList;
  }

  async getRelatedProductDetails(productId: number): Promise<ProductDetail> {
    return new Promise((resolve, reject) => {
      this.indexedService.getByIndex<ProductDetail>('ProductDetail', 'by-productId', productId).then((details) => {
        resolve(details[0]);
      });
    });
  }

  async getRelatedVisitorProduct(productDetailId: number): Promise<VisitorProduct> {
    return new Promise(async (resolve, reject) => {
      await this.indexedService.getByIndex<VisitorProduct>('VisitorProduct', 'by-productDetailId', productDetailId).then(visitorProducts => {
        resolve(visitorProducts[0]);
      });
    });
  }

  async getRelatedPhotoGalley(productId: number): Promise<PhotoGallery> {
    return new Promise((resolve, reject) => {
      this.indexedService.getByIndex<PhotoGallery>('PhotoGallery', 'by-itemCode', productId).then(photoGalleries => {
        if (photoGalleries != undefined)
          resolve(photoGalleries[0]);
        else {
          let temp: PhotoGallery = { CreateDate: '', CreateSyncId: 0, DataHash: '', Deleted: false, EntityType: 0, ItemCode: 0, ItemType: 0, PhotoGalleryId: 0, PictureId: 0, RowVersion: 0, UpdateDate: '', UpdateSyncId: 0 }
          resolve(temp);
        }
      });
    });
  }

  async getRelatedPicture(pictureId: number): Promise<Picture> {
    return new Promise((resolve, reject) => {
      this.indexedService.getByIndex<Picture>('Picture', 'by-pictureId', pictureId).then(pictures => {
        resolve(pictures[0]);
      });
    });
  }

  async getRelatedProductDetailStoreAsset(productDetailId: number): Promise<ProductDetailStoreAsset> {
    return new Promise((resolve, reject) => {
      this.indexedService.getByIndex<ProductDetailStoreAsset>('ProductDetailStoreAsset', 'by-productDetailId', productDetailId).then(assetsStores => {
        resolve(assetsStores[0]);
      });
    });
  }

  async getProductBaseOfCategory(categoryId: number[]) {
    return new Promise((resolve) => {
      this.indexedService.getByIndex_multivalue('Product', 'by-productCategoryId', categoryId).then(res => {
        resolve(res);
      });
    });
  }
}