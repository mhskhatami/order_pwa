export interface StoreNameModel {
    storeName: string,
    indexes?: IndexesModel[]
}

export interface IndexesModel {
    indexName: string, 
    indexValue: string
}