export interface Cheque {
    ChequeId: number;
    ChequeClientId: number;
    ChequeCode: number;
    ReceiptId: number;
    BankId: number;
    Number: string;
    BankName: string;
    Branch: string;
    Amount: number;
    Date: string;
    Type: number;
    Description: string;
    Deleted: boolean;
    DataHash: string;
    CreateDate: string;
    UpdateDate: string;
    CreateSyncId: number;
    UpdateSyncId: number;
    RowVersion: number;
    ReceiptClientId: number;
    ReceiptCode: number;
    BankClientId: number;
    BankCode: number;
}
