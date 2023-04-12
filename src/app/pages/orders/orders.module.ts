import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { OrdersPaymentDetailsComponent } from './orders-payment-details/orders-payment-details.component';
import { PaymentComponent } from './payment/payment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OrdersComponent } from './order/orders.component';
import { OrderdRoutingModule } from './orders-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SplitOrderComponent } from './split-order/split-order.component';


@NgModule({
	declarations: [
		OrdersComponent,
		OrdersPaymentDetailsComponent,
		PaymentComponent,
  SplitOrderComponent,
		
	],
	imports: [
		CommonModule,
		OrderdRoutingModule,
		FormsModule,
		MatTableModule,
		MatCardModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule
	]
})
export class OrdersModule {
}
