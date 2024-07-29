export interface Receipt {
    ReceiptId: number;
    ReceiptClientId: number;
    ReceiptCode: number;
    PersonId: number;
    VisitorId: number;
    CashAmount: number;
    CashCode: number;
    Description: string;
    Date: string;
    TrackingCode: string;
    ProjectId: number | null;
    OrderId: number | null;
    Deleted: boolean;
    DataHash: string;
    CreateDate: string;
    UpdateDate: string;
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
    PersonClientId: number;
    PersonCode: number;
    VisitorClientId: number;
    VisitorCode: number;
    OrderClientId: number;
    OrderCode: number;
}
