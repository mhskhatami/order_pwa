import { Injectable } from '@angular/core';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { Promotion, PromotionOtherFields } from 'src/app/core/models/bazara/bazara-DTOs/promotion';
import { InvoiceSummary } from 'src/app/core/models/bazara/bazara-DTOs/invoice-summary';
import { PromotionDetail, PromotionDetailOtherFields } from '../models/bazara/bazara-DTOs/promotion-detail';
import * as moment from 'jalali-moment';
import { OtherFields, PromotionEntity } from '../models/bazara/bazara-DTOs/promotion-entity';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  promotions: Promotion[] = [];

  constructor(private indexedDbService: IndexedDbService) {
    this.getActivePromotions().catch(console.error);
  }

  async getActivePromotions(): Promise<Promotion[]> {
    try {
      this.promotions = await this.indexedDbService.getAllData<Promotion>("Promotion");
      const nowISO = new Date().toISOString();
      return this.promotions.filter(promo => {
        const otherFields: PromotionOtherFields = JSON.parse(promo.OtherFields);
        return this.transformDate(otherFields.DateStart) <= nowISO && this.transformDate(otherFields.DateEnd) >= nowISO && !promo.Deleted;
      });
    } catch (error) {
      console.error("Error fetching active promotions:", error);
      return [];
    }
  }

  transformDate(value: string): string {
    try {
      const m = moment(value, 'jYYYY/jM/jD').locale('en');
      return m.toISOString();
    } catch (error) {
      console.error("Error transforming date:", error);
      return '';
    }
  }

  async getEligiblePromotions(
    invoiceSummary: InvoiceSummary, 
    personCode: number, 
    visitorCode: number, 
    productCodes: number[],
    serviceCodes: number[],
    anbarCodes: number[]
  ): Promise<{promotion: Promotion, details: PromotionDetailOtherFields[]}[]> {
    const eligiblePromotions: {promotion: Promotion, details: PromotionDetailOtherFields[]}[] = [];

    for (const promo of this.promotions) {
      const promotionOtherFields: PromotionOtherFields = JSON.parse(promo.OtherFields);
      if (!(await this.isEntityEligibleForPromotion(promo, promotionOtherFields, personCode, visitorCode, productCodes, serviceCodes, anbarCodes))) {
        continue;
      }

      const promotionDetails = await this.getPromotionDetails(promo.PromotionId);
      const eligibleDetails = promotionDetails
        .map(detail => JSON.parse(detail.OtherFields))
        .filter(detailOtherFields => this.isEligibleForPromotion(invoiceSummary, promo, detailOtherFields));
      
      if (eligibleDetails.length > 0) {
        eligiblePromotions.push({ promotion: promo, details: eligibleDetails });
      }
    }

    return eligiblePromotions;
  }

  private async isEntityEligibleForPromotion(
    promo: Promotion,
    promotionOtherFields: PromotionOtherFields, 
    personCode: number, 
    visitorCode: number, 
    productCodes: number[],
    serviceCodes: number[],
    anbarCodes: number[]
  ): Promise<boolean> {

    console.log(promotionOtherFields.IsAllCustomer);
    console.log(await this.isCustomerEligibleForPromotion(promo.PromotionId, personCode));

    console.log((
      (promotionOtherFields.IsAllCustomer || await this.isCustomerEligibleForPromotion(promo.PromotionId, personCode)) &&
      (promotionOtherFields.IsAllVisitor || await this.isVisitorEligibleForPromotion(promo.PromotionId, visitorCode)) &&
      (promotionOtherFields.IsAllGood || await this.areProductsEligibleForPromotion(promo.PromotionId, productCodes)) &&
      (promotionOtherFields.IsAllService || await this.areServicesEligibleForPromotion(promo.PromotionId, serviceCodes)) &&
      (promotionOtherFields.IsAllAnbar || await this.areAnbarsEligibleForPromotion(promo.PromotionId, anbarCodes))
    ));
    
    return (
      (promotionOtherFields.IsAllCustomer || await this.isCustomerEligibleForPromotion(promo.PromotionId, personCode)) &&
      (promotionOtherFields.IsAllVisitor || await this.isVisitorEligibleForPromotion(promo.PromotionId, visitorCode)) &&
      (promotionOtherFields.IsAllGood || await this.areProductsEligibleForPromotion(promo.PromotionId, productCodes)) &&
      (promotionOtherFields.IsAllService || await this.areServicesEligibleForPromotion(promo.PromotionId, serviceCodes)) &&
      (promotionOtherFields.IsAllAnbar || await this.areAnbarsEligibleForPromotion(promo.PromotionId, anbarCodes))
    );
  }

  private async areProductsEligibleForPromotion(promotionId: number, productCodes: number[]): Promise<boolean> {
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");
    return productCodes.some(productCode => 
      promotionEntities.some(entity => {
        const otherFields: OtherFields = JSON.parse(entity.OtherFields);
        return entity.PromotionId === promotionId && otherFields.EntityType === 3 && otherFields.CodeEntity === productCode;
      })
    );
  }
  
  private async areServicesEligibleForPromotion(promotionId: number, serviceCodes: number[]): Promise<boolean> {
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");
    return serviceCodes.some(serviceCode => 
      promotionEntities.some(entity => {
        const otherFields: OtherFields = JSON.parse(entity.OtherFields);
        return entity.PromotionId === promotionId && otherFields.EntityType === 4 && otherFields.CodeEntity === serviceCode;
      })
    );
  }
  
  private async areAnbarsEligibleForPromotion(promotionId: number, anbarCodes: number[]): Promise<boolean> {
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");
    return anbarCodes.some(anbarCode => 
      promotionEntities.some(entity => {
        const otherFields: OtherFields = JSON.parse(entity.OtherFields);
        return entity.PromotionId === promotionId && otherFields.EntityType === 5 && otherFields.CodeEntity === anbarCode;
      })
    );
  }
  
  private async isCustomerEligibleForPromotion(promotionId: number, personCode: number): Promise<boolean> {
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");
    console.log(promotionEntities);
    
    return promotionEntities.some(entity => {
      const otherFields: OtherFields = JSON.parse(entity.OtherFields);
      console.log(otherFields);
      console
      
      return entity.PromotionId == promotionId && otherFields.EntityType == 2 && otherFields.CodeEntity == personCode;
    });
  }

  private async isVisitorEligibleForPromotion(promotionId: number, visitorCode: number): Promise<boolean> {
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");
    return promotionEntities.some(entity => {
      const otherFields: OtherFields = JSON.parse(entity.OtherFields);
      return entity.PromotionId === promotionId && otherFields.EntityType === 1 && otherFields.CodeEntity === visitorCode;
    });
  }
  
  private async getPromotionDetails(promotionId: number): Promise<PromotionDetail[]> {
    const allDetails = await this.indexedDbService.getAllData<PromotionDetail>("PromotionDetail");
    return allDetails.filter(detail => detail.PromotionId === promotionId);
  }

  private isEligibleForPromotion(invoiceSummary: InvoiceSummary, promotion: Promotion, detailOtherFields: PromotionDetailOtherFields): boolean {
    const promotionOtherFields: PromotionOtherFields = JSON.parse(promotion.OtherFields);

    switch (promotionOtherFields.AccordingTo) {
      case 0: // مبلغ کل فاکتور
        return invoiceSummary.TotalInvoiceAmount > detailOtherFields.ToPayment;
      case 1: // جمع اقلام فاکتور
        return invoiceSummary.TotalItemAmount > detailOtherFields.ToPayment;
      case 2: // جمع حجم اقلام
        return invoiceSummary.TotalItemVolume > detailOtherFields.ToPayment;
      case 3: // جمع وزن اقلام
        return invoiceSummary.TotalItemWeight > detailOtherFields.ToPayment;
      case 4: // جمع انواع اقلام فاکتور
        return invoiceSummary.TotalItemTypes > detailOtherFields.ToPayment;
      case 5: // مبلغ سطر
        return invoiceSummary.LineAmount > detailOtherFields.ToPayment;
      case 6: // مقدار سطر
        return invoiceSummary.LineQuantity > detailOtherFields.ToPayment;
      default:
        return false;
    }
  }
}
