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
  amountCurrencyDollar:number=0;
  amountCurrencyShekel:number=0;
  dollarValue:number=3.66;
  digits = 2;
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
    this.amountCurrencyShekel +=parseFloat(this.amount);
    this.sum += parseFloat(this.amount);
    if (this.amount !== undefined) {
      this.remainingValue = parseFloat((this.sum - this.order.subTotal).toFixed(this.digits));
      if (this.remainingValue < 0) {
        this.remainingValue = 0;
      }
    }
    this.amount = '0';
  }

  dollarRemaining() {
    this.showAlert = false;
    if (!this.order) {
      return
    }
    this.amountCurrencyDollar +=parseFloat(this.amount);
    if (this.amount !== undefined) {
      this.dollarConvert = parseFloat(this.amount) * this.dollarValue;
      this.sum += this.dollarConvert;
      this.remainingValue = parseFloat((this.sum - (this.order.subTotal)).toFixed(this.digits));
      if (this.remainingValue < 0) {
        this.remainingValue = 0;
      }
    }
    this.amount = '0';
  }
  
  pay() {
    if (this.sum == this.order?.subTotal || this.sum > this.order!.subTotal) {
      if (!this.order) {
        return;
      }
      let isFullyPaid = true;
      this.order.orderDetail.forEach(orderDetail => {
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
          console.log(this.order.tableID + " is already")
          this.orderService.tableIds.length = 0;
          this.orderService.tableIds.push(this.order.tableID);
          this.tableService.updateTable(this.orderService.tableIds)
            .subscribe(table => {
              console.log(table);
            });
        }
        this.orderService.addOrder(this.order).subscribe(
          (response) => {
            console.log('Order created successfully', response);
          }
          ,
          (error) => {
            console.log('Error creating order', error);
          }
        );
      }
      this.orderService.add(this.order);
      this.orderService.delteOrderFromStorge(this.order);
      this.dialogRef.close();
    }
    else {
      this.showAlert = true;
    }
  }
}