import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from 'src/app/core/models/bazara/bazara-DTOs/promotion';
import { PromotionEntity } from 'src/app/core/models/bazara/bazara-DTOs/promotion-entity';
import { IndexedDbService } from 'src/app/core/services/indexed-db/indexed-db.service';

interface OtherFields {
  CodeEntity: number;
  CodePromotionEntity: number;
  EntityType: number;
}

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {

  promotions: Promotion[] = [];
  promotionEntities: PromotionEntity[] = [];
  isLoading = false;
  searchText = '';

  constructor(private indexedDbService: IndexedDbService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPromotionsAndEntities().then(() => {
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  async loadPromotionsAndEntities() {
    const promotions = await this.indexedDbService.getAllData<Promotion>("Promotion");
    console.log(promotions);
    
    const promotionEntities = await this.indexedDbService.getAllData<PromotionEntity>("PromotionEntity");

    this.promotions = promotions.filter(promotion => !promotion.Deleted);
    this.promotionEntities = promotionEntities.filter(entity => !entity.Deleted);
  }

  get filteredPromotions() {
    return this.promotions.filter(promotion =>
      this.getOtherField(promotion, 'NamePromotion').toLowerCase().includes(this.searchText.toLowerCase())
    )
  }

  parseOtherFields(otherFieldsStr: string): any {
    return JSON.parse(otherFieldsStr);
  }

  getOtherField(promotion: Promotion, fieldName: string): string {
    const otherFields = this.parseOtherFields(promotion.OtherFields);
    return otherFields[fieldName] || 'تعیین نشده';
  }

  getOtherFieldAsNumber(promotion: Promotion, fieldName: string): number {
    const otherFields = this.parseOtherFields(promotion.OtherFields);
    return Number(otherFields[fieldName]) || 0;
  }

  getOtherFieldAsBoolean(promotion: Promotion, fieldName: string): boolean {
    const otherFields = this.parseOtherFields(promotion.OtherFields);
    return Boolean(otherFields[fieldName]);
  }

  getText(fieldName: string, value: any): string {
    switch (fieldName) {
      case 'LevelPromotion':
        switch (value) {
          case 0: return 'کالا';
          case 1: return 'خدمات';
          case 2: return 'کالا و خدمات';
          default: return '';
        }
      case 'AccordingTo':
        switch (value) {
          case 0: return 'مبلغ کل فاکتور';
          case 1: return 'جمع اقلام فاکتور';
          case 2: return 'جمع حجم اقلام';
          case 3: return 'جمع وزن اقلام';
          case 4: return 'جمع انواع اقلام فاکتور';
          case 5: return 'مبلغ سطر';
          case 6: return 'مقدار سطر';
          default: return '';
        }
      case 'IsAllCustomer':
        return value ? 'همه مشتریان' : 'مشتریان خاص';
      case 'IsAllGood':
        return value ? 'همه کالاها' : 'کالای خاص';
      case 'IsAllService':
        return value ? 'همه خدمات' : 'خدمات خاص';
      case 'IsAllAnbar':
        return value ? 'همه انبارها' : 'انبار خاص';
      case 'IsAllVisitor':
        return value ? 'همه ویزیتورها' : 'ویزیتورهای خاص';
      case 'TypeTasvieh':
        switch (value) {
          case 0: return 'تعیین نشده';
          case 1: return 'نقد';
          case 2: return 'چک';
          case 3: return 'نقد و چک';
          case 4: return 'نسیه';
          default: return '';
        }
      case 'IsCalcLinear':
        return value ? 'خطی' : 'پلکانی';
      default:
        return '';
    }
  }

  getEntitiesForPromotion(promotion: Promotion) {
    const promotionEntities = this.promotionEntities.filter(entity => entity.PromotionId === promotion.PromotionId);
    return promotionEntities;
  }
  

  getEntityType(entity: PromotionEntity): number {
    const otherFields = this.parseOtherFields(entity.OtherFields);
    return otherFields.EntityType;
  }

  goToDetail(promotionId: number) {
    this.router.navigate(['/promotion-detail', promotionId]);
  }

  // Function to get CodeEntity based on EntityType
  getCodeEntity(entity: PromotionEntity): number {
      const otherFields = this.parseEntityOtherFields(entity.OtherFields);
      return otherFields.CodeEntity 
  }
 parseEntityOtherFields(otherFieldsJson: string): OtherFields {
  try {
    return JSON.parse(otherFieldsJson) as OtherFields;
  } catch (error) {
    console.error('Error parsing OtherFields JSON:', error);
    return {} as OtherFields; // Return empty object in case of error
  }
}

}
