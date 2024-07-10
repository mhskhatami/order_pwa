export interface Promotion {
    PromotionId: number;
    PromotionClientId: number;
    PromotionCode: number;
    Visitors: string;
    Stores: string;
    OtherFields: string; // JSON string containing additional fields
    Deleted: boolean;
    DataHash: string;
    CreateDate: string; // ISO 8601 date string
    UpdateDate: string; // ISO 8601 date string
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
}

export interface PromotionOtherFields {
    NamePromotion: string;
    PriorityPromotion: number;
    DateStart: string; // Assuming this is in a specific date format
    DateEnd: string;   // Assuming this is in a specific date format
    TimeStart: string;
    TimeEnd: string;
    LevelPromotion: number;
    AccordingTo: number;
    IsCalcLinear: boolean;
    TypeTasvieh: number;
    DeadlineTasvieh: number;
    IsAllCustomer: boolean;
    IsAllVisitor: boolean;
    IsAllGood: boolean;
    IsAllService: boolean;
    IsAllAnbar: boolean;
    AggregateWithOther: number;
}
