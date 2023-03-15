import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { PaymentComponent } from '../payment/payment.component';
@Component({
  selector: 'app-orders-payment-details',
  templateUrl: './orders-payment-details.component.html',
  styleUrls: ['./orders-payment-details.component.css']
})
export class OrdersPaymentDetailsComponent implements OnInit, DoCheck {
  @Input() id: number = 0;
  selectedOrderId: any;
  order!: Order | null;
  showCard = true;
  constructor(public dialog: MatDialog, private orderService: OrdersService) { }
  ngOnInit(): void {
  }
  ngDoCheck(): void {
    this.order = this.orderService.getOrderByID(this.id);
    console.log(this.id)
  }
  openPayment() {
    const dialogRef = this.dialog.open(PaymentComponent);
  }
}