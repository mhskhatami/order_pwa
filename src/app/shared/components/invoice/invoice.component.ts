import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropertyDescription } from 'src/app/core/models/bazara/bazara-DTOs/property-description';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { Order } from 'src/app/core/models/bazara/bazara-DTOs/order';
import { OrderDetail } from 'src/app/core/models/bazara/bazara-DTOs/order-detail';
import { Product } from 'src/app/core/models/bazara/bazara-DTOs/product';
import { ProductDetail } from 'src/app/core/models/bazara/bazara-DTOs/productDetail';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { PromotionService } from 'src/app/core/services/pages-services/promotion.service';
import { Setting } from 'src/app/core/models/bazara/bazara-DTOs/setting';
import { PromotionDetailOtherFields } from 'src/app/core/models/bazara/bazara-DTOs/promotion-detail';
import { PromotionOtherFields } from 'src/app/core/models/bazara/bazara-DTOs/promotion';

export interface InvoiceSummary {
  TotalInvoiceAmount: number; // مبلغ کل فاکتور
  TotalItemAmount: number; // جمع اقلام فاکتور
  TotalItemVolume: number; // جمع حجم اقلام
  TotalItemWeight: number; // جمع وزن اقلام
  TotalItemTypes: number; // جمع انواع اقلام فاکتور
  LineAmount: number; // مبلغ سطر
  LineQuantity: number; // مقدار سطر
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  getPropertyTitle(propertyCode: string): string {
    const propertyCodeNumber = Number(propertyCode);
    const property = this.propertyDescriptions.find(desc => desc.PropertyDescriptionCode === propertyCodeNumber);
    return property ? property.Title : 'Unknown Property';
  }

  invoiceForm: FormGroup;
  order!: Order;
  person!:Person;
  people: Person[] = [];
  products: Product[] = [];
  settings: Setting[] = [];
  productDetails: ProductDetail[] = [];
  propertyDescriptions: PropertyDescription[] = [];
  selectedCustomer: Person | null = null;
  invoiceItems: OrderDetail[] = [];
  subtotal: number = 0;
  taxPercent: number = 0;
  chargePercent: number = 0;
  total: number = 0;
  productPrices: number[] = [];
  selectedProductDetails: ProductDetail[] = [];
  selectedProductProperties: string = '';
  selectedProductDetail: ProductDetail | undefined = undefined;
  displayedColumns: string[] = ['product', 'quantity', 'price', 'action'];
  visitorId = localStorage.getItem('VisitorId')!;

  totalTax: number = 0;
  totalCharge: number = 0;

  discountAmount: number = 0;
  discountType: number = 0; // 0 for amount, 1 for percentage
  discountValue: number = 0;

  invoiceSummary: InvoiceSummary = {
    TotalInvoiceAmount: 0,
    TotalItemAmount: 0,
    TotalItemVolume: 0,
    TotalItemWeight: 0,
    TotalItemTypes: 0,
    LineAmount: 0,
    LineQuantity: 0,
  };

  constructor(
    private formBuilder: FormBuilder,
    private indexedDbService: IndexedDbService,
    private promotionService: PromotionService
  ) {
    this.invoiceForm = this.formBuilder.group({
      customer: [null, Validators.required],
      product: [null, Validators.required],
      productDetail: [null, Validators.required],
      productProperty: [null, Validators.required],
      price: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      discount: [0, Validators.required],
      discountType: [0, Validators.required]
    });

    this.invoiceForm.get('discount')?.valueChanges.subscribe(() => this.onDiscountChange());
    this.invoiceForm.get('discountType')?.valueChanges.subscribe(() => this.onDiscountChange());

  }

  onDiscountChange(): void {
    this.discountAmount = this.invoiceForm.get('discount')?.value;

    if(this.discountAmount == null)
      this.discountAmount = 0;
    
    this.discountType = this.invoiceForm.get('discountType')?.value;
    this.calculateTotal();
    this.calculateInvoiceSummary();
  }


  ngOnInit(): void {
    this.fetchProductsAndProductDetails();
    this.fetchPeople();
    this.fetchPropertyDescriptions();
    this.fetchSettings();
  }

  async fetchSettings(): Promise<void> {
    this.settings = await this.indexedDbService.getAllData<Setting>("Setting");
    const taxAndDutyActive = this.settings.find(s => s.SettingCode === 14008)?.Value === "1.00000000";
    this.taxPercent = taxAndDutyActive ? Number(this.settings.find(s => s.SettingCode === 14001)?.Value) / 100 : 0;
    this.chargePercent = taxAndDutyActive ? Number(this.settings.find(s => s.SettingCode === 14000)?.Value) / 100 : 0;
  }

  fetchPeople() {
    this.indexedDbService.getAllData<Person>("Person").then((people: Person[]) => {
      this.people = people;
    });
  }

  fetchProductsAndProductDetails(): void {
    this.indexedDbService.getAllData<Product>("Product").then((products: Product[]) => {
      this.products = products;
    });

    this.indexedDbService.getAllData<ProductDetail>("ProductDetail").then((productDetails: ProductDetail[]) => {
      this.productDetails = productDetails;
    });
  }

  fetchPropertyDescriptions(): void {
    this.indexedDbService.getAllData<PropertyDescription>("PropertyDescription").then((propertyDescriptions: PropertyDescription[]) => {
      this.propertyDescriptions = propertyDescriptions;
    });
  }

  updateProductDetails(): void {
    const selectedProductId = this.invoiceForm.get('product')?.value.ProductId;
    this.selectedProductDetails = this.productDetails.filter(detail => detail.ProductId === selectedProductId);

    if (this.selectedProductDetails.length > 0) {
      this.invoiceForm.get('productDetail')?.setValue(this.selectedProductDetails[0]);
      this.onProductDetailChange();

      // If there is only one product detail, ensure the price is updated
      if (this.selectedProductDetails.length === 1) {
        this.updateProductPrice({ C: '', V: '' });
      }
    }
  }

  updatePerson(): void {
    this.person = this.invoiceForm.get('customer')?.value;
    this.applyPromotionInvoice();
  }

  onProductDetailChange(): void {
    this.selectedProductDetail = this.invoiceForm.get('productDetail')?.value;
    if (this.selectedProductDetail) {
      this.selectedProductProperties = this.parseProperties(this.selectedProductDetail.Properties);

      if (this.selectedProductProperties.length > 0) {
        this.invoiceForm.get('productProperty')?.setValue(this.selectedProductProperties);
        this.onProductPropertyChange();
      } else {
        // If there are no properties, call updateProductPrice directly
        this.updateProductPrice({ C: '', V: '' });
      }
    }
  }

  onProductPropertyChange(): void {
    const selectedProperty = this.invoiceForm.get('productProperty')?.value;
    if (this.selectedProductDetail && selectedProperty) {
      // Update price based on the selected property
      this.updateProductPrice(selectedProperty);
    }
  }

  updateProductPrice(_selectedProperty: { C: string, V: string }): void {
    if (this.selectedProductDetail) {
      this.productPrices = [];
      for (let i = 1; i <= 10; i++) {
        const price = this.selectedProductDetail[`Price${i}`];
        if (price !== null && !isNaN(price)) {
          this.productPrices.push(price);
        }
      }
      this.invoiceForm.get('price')?.setValue(this.productPrices[0]);
    }
  }

  parseProperties(propertiesString: string | null | undefined): string {
    if (!propertiesString) return '';
    try {
      const properties = JSON.parse(propertiesString) as { C: string, V: string }[];
      return properties.map(prop => `${this.getPropertyTitle(prop.C)}: ${prop.V}`).join(', ');
    } catch (error) {
      console.error('Error parsing properties:', error);
      return '';
    }
  }

  getProductDetailDescription(productDetail: ProductDetail): string {
    return productDetail.Properties || 'No Description';
  }

  getProductName(productDetailId: number): string {
    const productDetail = this.productDetails.find(detail => detail.ProductDetailId === productDetailId);
    if (productDetail) {
      const product = this.products.find(product => product.ProductId === productDetail.ProductId);
      return product ? product.Name : 'Unknown';
    }
    return 'Unknown';
  }

  async addItemToInvoice(): Promise<void> {

    let discount = 0;
    let totalPrice = 0;
    let totalTaxCharge = 0;
    const now = new Date();
    const iranTimeOffset = 3.5;
    const localTime = new Date(now.getTime() + iranTimeOffset * 60 * 60 * 1000);
    const createDate = localTime.toISOString().replace('Z', '');

    this.discountValue = 0;

    this.discountAmount = this.invoiceForm.get('discount')?.value;
    this.discountType = this.invoiceForm.get('discountType')?.value;

    const selectedProductDetail = this.invoiceForm.get('productDetail')?.value as ProductDetail;
    const selectedProduct = this.products.find(p => p.ProductId === selectedProductDetail.ProductId);

    const quantity = this.invoiceForm.get('quantity')?.value;
    const price = this.invoiceForm.get('price')?.value;

    if (selectedProductDetail && selectedProduct && typeof price === 'number') {

      discount = this.getDefaultDiscountLevel(selectedProductDetail, discount);

      if (selectedProductDetail.DiscountType === 0) { // Percentage discount
        discount = (price * discount) / 100;
      }

      const unitPrice = price;
      totalPrice = price * quantity - discount * quantity;

      if (selectedProduct.TaxPercent != -1 && selectedProduct.ChargePercent != -1) {

        if (selectedProduct.TaxPercent != 0)
          this.taxPercent = selectedProduct.TaxPercent / 100
        if (selectedProduct.ChargePercent != 0)
          this.chargePercent = selectedProduct.ChargePercent / 100

        // Apply tax and charge
        const taxAmount = totalPrice * this.taxPercent;
        const chargeAmount = totalPrice * this.chargePercent;
        
        totalTaxCharge = taxAmount + chargeAmount

      }

      const orderDetail: OrderDetail = {
        ProductDetailId: selectedProductDetail.ProductDetailId,
        Count1: quantity,
        Price: totalPrice,
        OrderDetailId: 0,
        OrderDetailClientId: 0,
        ItemType: 0,
        OrderId: 0,
        IncomeId: 0,
        Count2: 0,
        PromotionCode: 0,
        Gift: 0,
        Description: '',
        Discount: discount * quantity,
        DiscountType: selectedProductDetail.DiscountType,
        TaxPercent: this.taxPercent,
        ChargePercent: this.chargePercent,
        StoreId: 0,
        Width: selectedProduct.Width,
        Height: selectedProduct.Height,
        ItemCount: 0,
        RowId: 0,
        Deleted: false,
        DataHash: '',
        CreateDate: createDate,
        UpdateDate: createDate,
        CreateSyncId: 0,
        UpdateSyncId: 0,
        RowVersion: 0,
        OrderClientId: 0,
        OrderCode: 0,
        ProductDetailClientId: 0,
        ProductDetailCode: 0,
        Weight: selectedProduct.Weight,
        UnitPrice: unitPrice
      };

      this.invoiceItems.push(orderDetail);
      this.calculateTotal();
      this.calculateInvoiceSummary();
      this.applyPromotionInvoice();

    } else {
      console.error('Invalid product or price');
      // Handle the error case, maybe show a message to the user
    }
  }

  private getDefaultDiscountLevel(selectedProductDetail: ProductDetail, discount: number) {
    switch (selectedProductDetail.DefaultDiscountLevel) {
      case 1:
        discount = selectedProductDetail.Discount1;
        break;
      case 2:
        discount = selectedProductDetail.Discount2;
        break;
      case 3:
        discount = selectedProductDetail.Discount3;
        break;
      case 4:
        discount = selectedProductDetail.Discount4;
        break;
      default:
        discount = 0;
    }
    return discount;
  }

  private getSpecificDiscountLevel(selectedProductDetail: ProductDetail, index: number) {
    switch (index) {
      case 1:
        return selectedProductDetail.Discount1;
      case 2:
        return selectedProductDetail.Discount2;
      case 3:
        return selectedProductDetail.Discount3;
      case 4:
        return selectedProductDetail.Discount4;
      default:
        return 0;
    }

  }

  removeItemFromInvoice(index: number): void {
    this.invoiceItems.splice(index, 1);
    this.calculateTotal();
    this.calculateInvoiceSummary();
    this.applyPromotionInvoice();
  }

  async applyPromotionInvoice(): Promise<void> {
    const productCodes = this.invoiceItems.map(item => {
      const productDetail = this.productDetails.find(pd => pd.ProductDetailId === item.ProductDetailId);
      return productDetail ? productDetail.ProductCode : 0;
    });
  
    const visitorCode = Number(this.visitorId);
    
    // Assuming you don't have service codes and anbar codes in your current implementation
    const serviceCodes: number[] = [];
    const anbarCodes: number[] = [];
  
    // Get all eligible promotions and their details
    const eligiblePromotions = await this.promotionService.getEligiblePromotions(
      this.invoiceSummary,
      this.person.PersonCode,
      visitorCode,
      productCodes,
      serviceCodes,
      anbarCodes
    );

    for (const { promotion, details } of eligiblePromotions) {
      const promotionOtherFields: PromotionOtherFields = JSON.parse(promotion.OtherFields);
  
      // Apply each eligible detail for this promotion
      for (const detailOtherFields of details) {
        await this.applyPromotionDetail(detailOtherFields);
      }
  
      // If this promotion doesn't aggregate with others, break after applying its details
      if (promotionOtherFields.AggregateWithOther !== 1) {
        break;
      }
  
      // Recalculate totals and summary after applying each promotion
      this.calculateTotal();
      this.calculateInvoiceSummary();
    }
  
    // Final recalculation after all promotions have been applied
    this.calculateTotal();
    this.calculateInvoiceSummary();
  }
  

private async applyPromotionDetail(detailOtherFields: PromotionDetailOtherFields): Promise<void> {
  switch (detailOtherFields.HowToPromotion) {
      case 1: // تخفیف به مبلغ ثابت (Fixed amount discount)
          this.applyFixedAmountDiscount(detailOtherFields.MeghdarPromotion);
          break;
      case 2: // تخفیف درصدی (Percentage discount)
          this.applyPercentageDiscount(detailOtherFields.MeghdarPromotion);
          break;
      case 3: // تخفیف از سطوح تخفیف (Discount from discount levels)
          this.applyDiscountLevel(detailOtherFields.MeghdarPromotion);
          break;
      case 4: // اشانتیون از همان کالا (Free item from the same product)
          this.applyFreeItemSameProduct(detailOtherFields.Meghdar);
          break;
      case 5: // اشانتیون از کالاهای دیگر (Free item from other products)
          await this.applyFreeItemOtherProduct(detailOtherFields.CodeGood, detailOtherFields.Meghdar);
          break;
      default:
          console.warn('Unknown promotion type');
  }
}
  
  private applyFixedAmountDiscount(amount: number): void {
    this.discountValue = amount;
  }
  
  private applyPercentageDiscount(percentage: number): void {
    const discountAmount = this.subtotal * (percentage / 100);
    this.discountValue = discountAmount;
  }
  
  private applyDiscountLevel(level: number): void {
    for (let item of this.invoiceItems) {
      const productDetail = this.productDetails.find(pd => pd.ProductDetailId === item.ProductDetailId);
      if (productDetail) {
        const discountPercentage = this.getSpecificDiscountLevel(productDetail, level);
        const itemDiscount = item.UnitPrice * item.Count1 * (discountPercentage / 100);

        // برگرداندن تخفیف اگر قبلا اعمال شده باشد
        item.Price += item.Discount

        item.Discount = itemDiscount;
        item.Price -= itemDiscount;
      }
    }
  }
  
  private applyFreeItemSameProduct(quantity: number): void {
    if (this.invoiceItems.length > 0) {
      const lastItem = this.invoiceItems[this.invoiceItems.length - 1];
      const freeItem: OrderDetail = { ...lastItem };
      freeItem.Count1 = quantity;
      freeItem.Price = 0;
      freeItem.UnitPrice = 0;
      freeItem.Discount = 0;
      freeItem.Gift = 1; // Mark as a gift
      this.invoiceItems.push(freeItem);
      
    }
  }
  
  private async applyFreeItemOtherProduct(productCode: number, quantity: number): Promise<void> {
    try {
      // Fetch all products
      const allProducts = await this.indexedDbService.getAllData<Product>("Product");
      
      // Find the product with the matching ProductCode
      const freeProduct = allProducts.find(product => product.ProductCode === productCode);
  
      if (freeProduct) {
        // Fetch all product details
        const allProductDetails = await this.indexedDbService.getAllData<ProductDetail>("ProductDetail");
        
        // Find the corresponding ProductDetail
        const freeProductDetail = allProductDetails.find(detail => detail.ProductId === freeProduct.ProductId);
  
        if (freeProductDetail) {
          const freeItem: OrderDetail = {
            ProductDetailId: freeProductDetail.ProductDetailId,
            Count1: quantity,
            Price: 0,
            OrderDetailId: 0,
            OrderDetailClientId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), // Generate a unique client ID
            ItemType: 0,
            OrderId: 0,
            IncomeId: 0,
            Count2: 0,
            PromotionCode: 0,
            Gift: 1, // Mark as a gift
            Description: 'Promotional free item',
            Discount: 0,
            DiscountType: 0,
            TaxPercent: 0,
            ChargePercent: 0,
            StoreId: 0,
            Width: freeProduct.Width,
            Height: freeProduct.Height,
            ItemCount: 0,
            RowId: 0,
            Deleted: false,
            DataHash: '',
            CreateDate: new Date().toISOString(),
            UpdateDate: new Date().toISOString(),
            CreateSyncId: 0,
            UpdateSyncId: 0,
            RowVersion: 0,
            OrderClientId: 0,
            OrderCode: 0,
            ProductDetailClientId: freeProductDetail.ProductDetailClientId,
            ProductDetailCode: freeProductDetail.ProductDetailCode,
            Weight: freeProduct.Weight,
            UnitPrice: 0
          };
  
          this.invoiceItems.push(freeItem);
  
          // Recalculate totals after adding the free item
          this.calculateTotal();
          this.calculateInvoiceSummary();
        } else {
          console.warn(`No ProductDetail found for Product with ProductCode ${productCode}`);
        }
      } else {
        console.warn(`No Product found with ProductCode ${productCode}`);
      }
    } catch (error) {
      console.error('Error applying free item promotion:', error);
    }
  }

  calculateTotal(): void {
    this.subtotal = this.invoiceItems.reduce((acc, item) => acc + item.Price, 0);

    if (this.discountType === 1) {
      this.discountValue = (this.subtotal * this.discountAmount) / 100;
    } else {
      this.discountValue = this.discountAmount;
    }
    
    const discountedSubtotal = this.subtotal - this.discountValue;
    this.totalTax = this.invoiceItems.reduce((acc, item) => acc + (item.Price * item.TaxPercent ), 0);
    this.totalCharge = this.invoiceItems.reduce((acc, item) => acc + (item.Price * item.ChargePercent ), 0);
    this.total = discountedSubtotal + this.totalTax + this.totalCharge;
  }


  calculateInvoiceSummary(): void {
    this.invoiceSummary.TotalInvoiceAmount = this.total;
    this.invoiceSummary.TotalItemAmount = this.subtotal - this.discountValue;
    this.invoiceSummary.TotalItemVolume = this.invoiceItems.reduce((acc, item) => acc + (item.Width * item.Height), 0);
    this.invoiceSummary.TotalItemWeight = this.invoiceItems.reduce((acc, item) => acc + item.Weight, 0);
    this.invoiceSummary.TotalItemTypes = this.invoiceItems.length;
    this.invoiceSummary.LineAmount = this.invoiceItems.reduce((acc, item) => acc + item.Price, 0);
    this.invoiceSummary.LineQuantity = this.invoiceItems.reduce((acc, item) => acc + item.Count1, 0);
  }

  resetInvoice(): void {
    this.invoiceForm.reset({ quantity: 1 });
    this.invoiceItems = [];
    this.subtotal = 0;
    this.total = 0;
    this.calculateInvoiceSummary();
  }

  async submitInvoice(): Promise<void> {
    const orderClientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    const now = new Date();
    const iranTimeOffset = 3.5;
    const localTime = new Date(now.getTime() + iranTimeOffset * 60 * 60 * 1000);
    const createDate = localTime.toISOString().replace('Z', '');

    const customerId = this.invoiceForm.get('customer')?.value.PersonId;

    const visitorId = this.indexedDbService.getVisitorId();
    let visitorIdnum = 0;
    if (visitorId !== undefined) {
      visitorIdnum = Number(visitorId);
    }

      this.order = {
      OrderId: orderClientId,
      OrderClientId: orderClientId,
      PersonId: customerId,
      PersonClientId: 0,
      OrderCode: 0,
      VisitorId: visitorIdnum,
      ReceiptId: 0,
      OrderType: 1,
      OrderDate: createDate,
      DeliveryDate: createDate,
      Discount: this.discountAmount,
      DiscountType: this.discountType,
      SendCost: 0,
      OtherCost: 0,
      SettlementType: 0,
      Immediate: false,
      ReturnReasonId: 0,
      Description: '',
      ExpenseId: 0,
      ProjectId: 0,
      Latitude: 0,
      Longitude: 0,
      ShippingAddress: '',
      CarrierType: '',
      CarrierID: '',
      DriverCurrencyType: '',
      CarryingAsExpense: false,
      ReferenceOrderId: 0,
      InvoiceTemplate: '',
      Deleted: false,
      DataHash: '',
      CreateDate: createDate,
      UpdateDate: createDate,
      CreateSyncId: 0,
      UpdateSyncId: 0,
      RowVersion: 0,
      PersonCode: 0,
      VisitorClientId: 0,
      VisitorCode: 0,
      ReceiptClientId: 0,
      ReceiptCode: 0
    };

    const orderDetails = this.invoiceItems.map(item => {
      const orderDetailClientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const orderDetail: OrderDetail = {
        OrderDetailId: orderDetailClientId,
        OrderDetailClientId: orderDetailClientId,
        ProductDetailId: item.ProductDetailId,
        ProductDetailClientId: 0,
        ItemType: 0,
        OrderClientId: orderClientId,
        IncomeId: 0,
        Price: item.Price,
        Count1: item.Count1,
        Count2: item.Count2,
        PromotionCode: 0,
        Gift: 0,
        Description: '',
        Discount: item.Discount,
        DiscountType: item.DiscountType,
        TaxPercent: item.TaxPercent,
        ChargePercent: item.ChargePercent,
        StoreId: 0,
        Width: 0,
        Height: 0,
        ItemCount: 0,
        RowId: 0,
        Deleted: false,
        DataHash: '',
        CreateDate: createDate,
        UpdateDate: createDate,
        CreateSyncId: 0,
        UpdateSyncId: 0,
        RowVersion: 0,
        OrderCode: 0,
        ProductDetailCode: 0,
        OrderId: orderClientId,
        Weight: 0,
        UnitPrice: item.UnitPrice
      };
      return orderDetail;
    });

    try {
      const order_key: IDBValidKey = [+this.visitorId, this.order.OrderClientId];
      await this.indexedDbService.addOrEdit<Order>("Order", this.order, order_key);
      console.log('Successfully stored order in IndexedDB');

      for (let detail of orderDetails) {
        const orderDetail_key: IDBValidKey = [+this.visitorId, detail.OrderDetailClientId];
        await this.indexedDbService.addOrEdit<OrderDetail>("OrderDetail", detail, orderDetail_key);
      }
      console.log('Successfully stored order details in IndexedDB');
    } catch (error) {
      console.error('Error storing order and order details in IndexedDB:', error);
    }

    this.resetInvoice();
  }
}
