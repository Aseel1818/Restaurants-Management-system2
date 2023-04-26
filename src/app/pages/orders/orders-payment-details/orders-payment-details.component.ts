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
  showAlert = false;
  showAlertAllPaid = false;

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
        subTotal += (orderDetail.item.price * orderDetail.quantity)
      }
    })

    this.order.subTotal = subTotal
  }

  openPayment() {
    let showAlert = false;
    if (this.order?.orderDetails.every(obj => obj.isChecked === false)) {
      if (this.order?.orderDetails.every(obj => obj.isPaid === true)) {
        this.showAlert = false;
        this.showAlertAllPaid = true;
        setTimeout(() => { this.showAlertAllPaid = false; }, 5000);
      }
      else {
        this.showAlert = true;
        setTimeout(() => { this.showAlert = false; }, 5000);
        this.showAlertAllPaid = false;
      }
    }
    else {
      this.showAlert = false;
      this.dialog.open(PaymentComponent, {
        data: { orderId: this.id }
      });
    }
  }

  selectAll() {
    this.order?.orderDetails.forEach(orderDetail => {
      if (!orderDetail.isPaid) {
        orderDetail.isChecked = true;
        this.updateSubTotal();
      }
    })
  }
}