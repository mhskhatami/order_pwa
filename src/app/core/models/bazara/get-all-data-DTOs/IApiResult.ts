import { Bank } from "../bazara-DTOs/Bank";
import { Person } from "../bazara-DTOs/Person";
import { PersonAddress } from "../bazara-DTOs/PersonAddress";
import { PhotoGallery } from "../bazara-DTOs/PhotoGallery";
import { Picture } from "../bazara-DTOs/picture";
import { Product } from "../bazara-DTOs/product";
import { ProductDetail } from "../bazara-DTOs/productDetail";
import { ProductDetailStoreAsset } from "../bazara-DTOs/productDetailAssetStore";
import { VisitorPerson } from "../bazara-DTOs/visitorPerson";
import { VisitorProduct } from "../bazara-DTOs/visitorProduct";
import { Mission } from "../bazara-DTOs/Mission";
import { MissionDetail } from "../bazara-DTOs/MissionDetail";
import { Order } from "../bazara-DTOs/order";
import { OrderDetail } from "../bazara-DTOs/order-detail";
import { ProductCategory } from "../bazara-DTOs/product-category";
import { PropertyDescription } from "../bazara-DTOs/property-description";
import { Setting } from "../bazara-DTOs/setting";
import { ExtraData } from "../bazara-DTOs/extra-data";
import { Promotion } from "../bazara-DTOs/promotion";
import { PromotionDetail } from "../bazara-DTOs/promotion-detail";
import { PromotionEntity } from "../bazara-DTOs/promotion-entity";
import { Cheque } from "../bazara-DTOs/cheque";
import { Receipt } from "../bazara-DTOs/receipt";
import { TransferAccount } from "../bazara-DTOs/transfer-account";
import { Visitor } from "../bazara-DTOs/visitor";

export interface IApiResult {
    Data: IObject,
    Result: boolean
}

export interface IObject {
    Objects: IBazaraData
}

export interface IBazaraData {
    Banks: Bank[],
    PersonAddresses: PersonAddress[],
    People: Person[],
    VisitorPeople: VisitorPerson[],
    Products: Product[],
    ProductDetails: ProductDetail[],
    VisitorProducts: VisitorProduct[],
    PhotoGalleries: PhotoGallery[],
    Pictures: Picture[],
    ProductDetailStoreAssets: ProductDetailStoreAsset[],
    Missions: Mission[],
    MissionDetails: MissionDetail[],
    ProductCategories:ProductCategory[],
    Orders:Order[],
    OrderDetails:OrderDetail[],
    PropertyDescriptions:PropertyDescription[],
    Settings:Setting[],
    ExtraDatas:ExtraData[],
    Promotions:Promotion[],
    PromotinDetails:PromotionDetail[],
    PromotionEntities:PromotionEntity[],
    Receipts:Receipt[],
    Cheques:Cheque[],
    TransferAccounts:TransferAccount[],
    Visitors:Visitor[]
}