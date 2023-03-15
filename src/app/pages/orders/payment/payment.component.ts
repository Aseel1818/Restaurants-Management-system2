import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { OrdersPaymentDetailsComponent } from '../orders-payment-details/orders-payment-details.component';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  total: number = 50;
  amount!: string;
  remainingValue!: number;
  dollarConvert!: number;
  order!: Order | null;
  constructor(public dialogRef: MatDialogRef<OrdersPaymentDetailsComponent>,
    private orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number }) { }
  ngOnInit(): void {
    this.order = this.orderService.getOrderByID(this.data.orderId);
  }

  remaining() {
    if(!this.order) {
      return
    }

    if (this.amount !== undefined) {
      this.remainingValue = parseFloat(this.amount) - (this.order.subTotal);
    }
  }
  dollarRemaining() {
    if(!this.order) {
      return
    }

    if (this.amount !== undefined) {
      this.dollarConvert = parseFloat(this.amount) * 3.67;
      this.remainingValue = this.dollarConvert - (this.order.subTotal);
    }

  }

  pay() {
    this.order?.orderDetails.forEach(orderDetail => {
      if(orderDetail.isChecked) {
        orderDetail.isPaid = true
      }
    })
  }
}

