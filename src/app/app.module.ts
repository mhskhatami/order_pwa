import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './shared/modules/material/material.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './shared/components/login/login.component'; // Import the component
import { PeopleListComponent } from './shared/components/people-list/people-list.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { BasicInfoComponent } from './shared/components/basic-info/basic-info.component';
import { BankListComponent } from './shared/components/bank-list/bank-list.component';
import { OrderListComponent } from './shared/components/order-list/order-list.component';
import { ProductCategoryComponent } from './shared/components/product-category/product-category.component';
import { OrderDetailComponent } from './shared/components/order-detail/order-detail.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { LogUpdateService } from './core/services/pwa_services/log-update.service';
import { PromptUpdateService } from './core/services/pwa_services/prompt-update.service';

import { UpdateConfirmationDialogComponent } from './shared/components/update-confirmation-dialog/update-confirmation-dialog.component';
import { InvoiceComponent } from './shared/components/invoice/invoice.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { MapComponent } from './shared/components/map/map.component';
import { ProductComponent } from './shared/components/product/product.component';
import { ProductCardComponent } from './shared/components/product/product-card/product-card.component';
import { MiniReportComponent } from './shared/components/mini-report/mini-report.component';
import { MissionComponent } from './shared/components/mission/mission.component';
import { OperationSectionComponent } from './shared/components/operation-section/operation-section.component';
import { MissionCardComponent } from './shared/components/mission/mission-card/mission-card.component';
import { RialCurrencyPipe } from './shared/pipe/rial-currency.pipe';
import { BottomSheetCategoryComponent } from './shared/components/product/bottom-sheet-category/bottom-sheet-category.component';
import { PersianDatePipe } from './shared/pipe/persian-date.pipe';
import { OrderComponent } from './shared/components/order/order.component';
import { OrderCardComponent } from './shared/components/order/order-card/order-card.component';
import { PromotionListComponent } from './shared/components/promotion-list/promotion-list.component';
import { PromotionDetailComponent } from './shared/components/promotion-detail/promotion-detail.component';
import { SumByPipe } from './shared/pipe/sum-by.pipe';
import { MissionDetailComponent } from './shared/components/mission/mission-detail/mission-detail.component';
import { MissionChangeStatusComponent } from './shared/components/mission/mission-change-status/mission-change-status.component';
import { PersonComponent } from './shared/components/person/person.component';
import { PersonCardComponent } from './shared/components/person/person-card/person-card.component';
import { ReceiptListComponent } from './shared/components/receipt-list/receipt-list.component';
import { ReceiptDetailComponent } from './shared/components/receipt-detail/receipt-detail.component';
import { ReceiptFormComponent } from './shared/components/receipt-form/receipt-form.component';
import { TransferAccountListComponent } from './shared/components/transfer-account-list/transfer-account-list.component';
import { TransferAccountFormComponent } from './shared/components/transfer-account-form/transfer-account-form.component';
import { TransferAccountDetailComponent } from './shared/components/transfer-account-detail/transfer-account-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PeopleListComponent,
    DashboardComponent,
    BasicInfoComponent,
    BankListComponent,
    ProductComponent,
    ProductCardComponent,
    ProductCategoryComponent,
    OrderComponent,
    OrderCardComponent,
    OrderListComponent,
    OrderDetailComponent,
    ToolbarComponent,
    UpdateConfirmationDialogComponent,
    InvoiceComponent,
    FooterComponent,
    DrawerComponent,
    MapComponent,
    MiniReportComponent,
    MissionComponent,
    OperationSectionComponent,
    MissionCardComponent,
    RialCurrencyPipe,
    SumByPipe,
    PersianDatePipe,
    BottomSheetCategoryComponent,
    PromotionListComponent,
    PromotionDetailComponent,
    MissionDetailComponent,
    MissionChangeStatusComponent,
    PersonComponent,
    PersonCardComponent,
    ReceiptListComponent,
    ReceiptFormComponent,
    ReceiptDetailComponent,
    TransferAccountListComponent,
    TransferAccountFormComponent,
    TransferAccountDetailComponent
  ],
  exports: [
    FooterComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    // LoginService, IndexedDbService, 
    LogUpdateService, PromptUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule { }