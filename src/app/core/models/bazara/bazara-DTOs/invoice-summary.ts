export interface InvoiceSummary {
    TotalInvoiceAmount: number; // مبلغ کل فاکتور
    TotalItemAmount: number; // جمع اقلام فاکتور
    TotalItemVolume: number; // جمع حجم اقلام
    TotalItemWeight: number; // جمع وزن اقلام
    TotalItemTypes: number; // جمع انواع اقلام فاکتور
    LineAmount: number; // مبلغ سطر
    LineQuantity: number; // مقدار سطر
}
