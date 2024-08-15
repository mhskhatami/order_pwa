export interface Visitor {
    VisitorId: number;
    VisitorClientId: number;
    VisitorCode: number;
    Name: string;
    ExtraInfo: string;
    Username: string;
    Password: string;
    PersonCode: number;
    StoreCode: number;
    CashCode: number;
    BankCode: number;
    VisitorType: number;
    DeviceId: string;
    Mobile: string;
    IsActive: boolean;
    Color: string;
    ChequeCredit: number;
    TotalCredit: number;
    SellPriceLevel: number;
    HasPriceAccess: boolean;
    HasPriceLevelAccess: boolean;
    SelectedPriceLevels: string;
    HasRadara: boolean;
    Deleted: boolean;
    DataHash: string | null;
    CreateDate: string;
    UpdateDate: string;
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
}

// Optional: You can also create an interface for the ExtraInfo object
export interface VisitorExtraInfo {
    PersonCode: number;
    StoreCode: number;
    CashCode: number;
    BankCode: number;
    DeviceId: string;
    Mobile: string;
    Color: string;
    ChequeCredit: number;
    TotalCredit: number;
    SellPriceLevel: number;
    HasPriceAccess: boolean;
    HasPriceLevelAccess: boolean;
    SelectedPriceLevels: string;
    HasRadara: boolean;
}
