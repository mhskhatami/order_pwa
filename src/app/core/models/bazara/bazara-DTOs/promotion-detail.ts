export interface PromotionDetail {
    IsCalcAdditive: any;
    PromotionDetailId: number;
    PromotionDetailClientId: number;
    PromotionDetailCode: number;
    PromotionId: number;
    OtherFields: string; // JSON string containing additional fields
    Deleted: boolean;
    DataHash: string;
    CreateDate: string; // ISO 8601 date string
    UpdateDate: string; // ISO 8601 date string
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
    PromotionClientId: number;
    PromotionCode: number;
}

export interface PromotionDetailOtherFields {
    CodePromotion_Det: number;
    HowToPromotion: number;
    IsCalcAdditive: boolean;
    ReducedEffectOnPrice: boolean;
    ToPayment: number;
    MeghdarPromotion: number;
    StoreCode: number;
    CodeGood: number;
    Tool: number;
    Arz: number;
    Tedad: number;
    Meghdar: number;
    Meghdar2: number;
    Ghotr: number;
    ToolidCode: number;
}


