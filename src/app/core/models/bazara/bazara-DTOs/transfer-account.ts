export interface TransferAccount {
    TransferAccountId: number;
    TransferAccountClientId: number;
    TransferAccountCode: number;
    Date: string;
    Type: number;
    ReceiverId: number;
    PayerType: number;
    PayerId: number;
    Price: number;
    VisitorId: number;
    Description: string;
    Deleted: boolean;
    DataHash: string;
    CreateDate: string;
    UpdateDate: string;
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
    VisitorClientId: number;
    VisitorCode: number;
}
