import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import { OrdersPaymentDetailsComponent } from '../orders-payment-details/orders-payment-details.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  amount!: string;
  remainingValue!: number;
  dollarConvert!: number;
  order!: Order | null;
  showAlert = false;
  sum: number = 0;

  constructor(public dialogRef: MatDialogRef<OrdersPaymentDetailsComponent>,
    private orderService: OrdersService,
    private tableService: TablesService,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number }) { }

  ngOnInit(): void {
    this.order = this.orderService.getOrderByID(this.data.orderId);
  }

  remaining() {
    this.showAlert = false;
    if (!this.order) {
      return
    }
    this.sum += parseFloat(this.amount);
    if (this.amount !== undefined) {
      this.remainingValue = this.sum - (this.order.subTotal);
      if (this.remainingValue < 0) {
        this.remainingValue = 0;
      }
    }
  }
  
  dollarRemaining() {
    this.showAlert = false;
    if (!this.order) {
      return
    }
    if (this.amount !== undefined) {
      this.dollarConvert = parseFloat(this.amount) * 3.67;
      this.sum += this.dollarConvert;
      this.remainingValue = this.sum - (this.order.subTotal);
      if (this.remainingValue < 0) {
        this.remainingValue = 0;
      }
    }
  }

  pay() {
    if (this.sum == this.order?.subTotal || this.sum > this.order!.subTotal) {
      if (!this.order) {
        return;
      }
      let isFullyPaid = true;
      this.order.orderDetails.forEach(orderDetail => {
        if (orderDetail.isChecked && !orderDetail.isPaid) {
          orderDetail.isPaid = true;
          this.order!.subTotal -= orderDetail.item.price * orderDetail.quantity;
        }
        if (!orderDetail.isPaid) {
          isFullyPaid = false;
        }
        orderDetail.isChecked = false;
      });
      if (isFullyPaid) {
        if (this.order?.tableID) {
          console.log(this.order.tableID)
          this.tableService.getTableById(this.order.tableID).subscribe(table => {
            this.tableService.updateTable(table).subscribe(table => {
              console.log(table.status);
            });
          });
        }
      }
      this.orderService.addOrder(this.order).subscribe(
        (response) => {
          console.log('Order created successfully', response);
        },
        (error) => {
          console.log('Error creating order', error);
        }
      );
      this.orderService.add(this.order);
      this.dialogRef.close();
    }
    else {
      this.showAlert = true;
    }
  }
}

