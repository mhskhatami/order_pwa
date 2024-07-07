export interface MissionDTO {
    MissionId?: number,
    MissionDate?: string,
    MainDescription?: string,
    MissionDetails?: MissionDetailDTO[]
    MissionCount?: number,
    SuccessMissionCount?: number,
    UnsuccessMissionCount?: number,
    MissionDone?: number,
    TakingOrderCount?: number, // دریافت سفارش
    DeliveryCount?: number, // تحویل کالا
    BardashtKalaCount?: number, // برداشت کالا
    VosoolMotalebatCount?: number, // وصول مطالبات
}

export interface MissionDetailDTO {
    MissionDetailId?: number,
    DetailDescription?: string
    PersonId?: number,
    PersonName?: string,
    PersonAddressId?: number,
    Title?: string,
    Status?: number,
    Type?: number,
    Priority?: number
}