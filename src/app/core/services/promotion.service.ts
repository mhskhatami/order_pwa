import { Injectable } from '@angular/core';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';
import { Promotion, PromotionOtherFields } from 'src/app/core/models/bazara/bazara-DTOs/promotion';
import { InvoiceSummary } from 'src/app/core/models/bazara/bazara-DTOs/invoice-summary';
import { PromotionDetail, PromotionDetailOtherFields } from '../models/bazara/bazara-DTOs/promotion-detail';
import * as moment from 'jalali-moment';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  promotions!: Promotion[];

  constructor(private indexedDbService: IndexedDbService) {
    this.getActivePromotions();
  }

  async getActivePromotions(): Promise<Promotion[]> {
   this.promotions = await this.indexedDbService.getAllData<Promotion>("Promotion");
    const now = new Date();
    return this.promotions.filter(promo => {
      const otherFields: PromotionOtherFields = JSON.parse(promo.OtherFields);
      return this.transformDate(otherFields.DateStart) <= now.toISOString() && this.transformDate(otherFields.DateEnd) >= now.toISOString();
    });
  }

  transformDate(value: string): string {
    // Convert the Persian date string to a moment object
    let m = moment(value, 'jYYYY/jM/jD');
    m.locale('en');
    let gregorianDateISO = m.toISOString();
    return gregorianDateISO;
  }

  async getEligiblePromotions(invoiceSummary: InvoiceSummary): Promise<{promotion: Promotion, details: PromotionDetailOtherFields[]}[]> {
    const eligiblePromotions: {promotion: Promotion, details: PromotionDetailOtherFields[]}[] = [];

    console.log(this.promotions);
    

    for (const promo of this.promotions) {
        const promotionDetails = await this.getPromotionDetails(promo.PromotionId);
        const eligibleDetails: PromotionDetailOtherFields[] = [];

        for (const detail of promotionDetails) {
            const detailOtherFields: PromotionDetailOtherFields = JSON.parse(detail.OtherFields);
            if (this.isEligibleForPromotion(invoiceSummary, promo, detailOtherFields)) {
                eligibleDetails.push(detailOtherFields);
            }
        }

        if (eligibleDetails.length > 0) {
            eligiblePromotions.push({promotion: promo, details: eligibleDetails});
        }
    }

    return eligiblePromotions;
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
