import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/classes/order.class';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { Table } from 'src/app/interfaces/table.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import { PaymentComponent } from '../payment/payment.component';
import { HttpClient } from '@angular/common/http';
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
  selectedItems: OrderDetail[] = [];
  constructor(public dialog: MatDialog,
    private orderService: OrdersService, private http: HttpClient) {
  }


  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.order = this.orderService.getOrderByID(this.id);
  }
  updateSubTotal() {
    if (!this.order) {
      return
    }

    let subTotal = 0
    this.order.orderDetails.forEach(orderDetail => {
      if (orderDetail.isChecked) {
        subTotal += orderDetail.item.price * orderDetail.quantity
      }
    })

    this.order.subTotal = subTotal
  }

  openPayment() {
    this.dialog.open(PaymentComponent, {
      data: { orderId: this.id}
    });
  }
}