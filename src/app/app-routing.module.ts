import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './shared/components/login/login.component';
import { PeopleListComponent } from './shared/components/people-list/people-list.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { BasicInfoComponent } from './shared/components/basic-info/basic-info.component';
import { BankListComponent } from './shared/components/bank-list/bank-list.component';
import { OrderListComponent } from './shared/components/order-list/order-list.component';
import { ProductCategoriesComponent } from './shared/components/product-categories/product-categories.component';
import { OrderDetailComponent } from './shared/components/order-detail/order-detail.component';
import { InvoiceComponent } from './shared/components/invoice/invoice.component';
import { authGuard } from './core/services/authorizing/auth.guard';
import { GetBazaraDataComponent } from './shared/components/get-bazara-data/get-bazara-data.component';
import { ProductComponent } from './shared/components/product/product.component';
import { MapComponent } from './shared/components/map/map.component';
import { OrderComponent } from './shared/components/order/order.component';
import { ReportsComponent } from './shared/components/reports/reports.component';
import { PromotionListComponent } from './shared/components/promotion-list/promotion-list.component';
import { PromotionDetailComponent } from './shared/components/promotion-detail/promotion-detail.component';
import { MissionDetailComponent } from './shared/components/mission/mission-detail/mission-detail.component';
import { PersonComponent } from './shared/components/person/person.component';
import { PersonDetailComponent } from './shared/components/person/person-detail/person-detail.component';
import { ReceiptFormComponent } from './shared/components/receipt-form/receipt-form.component';
import { ReceiptListComponent } from './shared/components/receipt-list/receipt-list.component';
import { TransferAccountListComponent } from './shared/components/transfer-account-list/transfer-account-list.component';
import { TransferState } from '@angular/platform-browser';
import { TransferAccountFormComponent } from './shared/components/transfer-account-form/transfer-account-form.component';
import { TransferAccountDetailComponent } from './shared/components/transfer-account-detail/transfer-account-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'people-list', component: PersonComponent, canActivate: [authGuard] },
  { path: 'people-list/:personId', component: PersonDetailComponent, canActivate: [authGuard] },
  { path: 'receipt-form', component: ReceiptFormComponent, canActivate: [authGuard] },
  { path: 'transfer-account-form', component: TransferAccountFormComponent, canActivate: [authGuard] },
  { path: 'transfer-account-detail', component: TransferAccountDetailComponent, canActivate: [authGuard] },
  { path: 'receipt-list', component: ReceiptListComponent, canActivate: [authGuard] },
  { path: 'transfer-account-list', component: TransferAccountListComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'basic-info', component: BasicInfoComponent, canActivate: [authGuard] },
  { path: 'map', component: MapComponent, canActivate: [authGuard] },
  { path: 'update-info', component: GetBazaraDataComponent, canActivate: [authGuard] },
  { path: 'bank-list', component: BankListComponent, canActivate: [authGuard] },
  { path: 'product', component: ProductComponent, canActivate: [authGuard] },
  // { path: 'product-list/:categoryId', component: ProductListComponent, canActivate: [authGuard] }, 
  { path: 'order-list', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'reports-orders', component: OrderComponent, canActivate: [authGuard] },
  { path: 'promotion-list', component: PromotionListComponent, canActivate: [authGuard] },
  { path: 'promotion-detail/:id', component: PromotionDetailComponent , canActivate: [authGuard] },
  { path: 'product-categories', component: ProductCategoriesComponent, canActivate: [authGuard] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard] },
  { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'mission-detail', component: MissionDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }