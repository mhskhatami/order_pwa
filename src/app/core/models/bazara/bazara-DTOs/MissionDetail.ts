export interface MissionDetail {
    MissionDetailId: number;
    AccountId: number;
    DatabaseId: number;
    MissionDetailCode: number;
    MissionDetailClientId: number;
    Status: number;
    Priority: number;
    Date: string | null;
    Type: number;
    PersonId: number;
    PersonAddressId: number;
    Description: string;
    ActivityID: number | null;
    MissionId: number;
    Deleted: boolean;
    RowVersion: number;
    CreateDate: string;
    UpdateDate: string;
    PersonClientId: number;
    PersonCode: number;
    MissionClientId: number;
    MissionCode: number;
    IsSync: boolean
}