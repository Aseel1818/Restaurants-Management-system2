import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { OrdersPaymentDetailsComponent } from './orders-payment-details/orders-payment-details.component';
import { PaymentComponent } from './payment/payment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OrdersComponent } from './order/orders.component';
import { OrderdRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersPaymentDetailsComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    OrderdRoutingModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class OrdersModule { }
