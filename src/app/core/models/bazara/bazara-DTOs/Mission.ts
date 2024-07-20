export interface Mission {
    MissionId: number;
    DatabaseId: number;
    MissionCode: number;
    AccountId: number;
    MissionClientId: number;
    StatusAdmin: number | null;
    Date: string;
    StatusDate: string | null;
    Deleted: boolean;
    Description: string | null;
    RowVersion: number;
    CreateDate: string;
    UpdateDate: string;
    IsSync?: boolean 
}
