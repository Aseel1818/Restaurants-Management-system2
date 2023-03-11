import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from '../payment/payment.component';
@Component({
  selector: 'app-orders-payment-details',
  templateUrl: './orders-payment-details.component.html',
  styleUrls: ['./orders-payment-details.component.css']
})
export class OrdersPaymentDetailsComponent{
  constructor(public dialog: MatDialog) {
    console.log(this.id)
  }
  @Input() id='' ;
  showCard = true;
  openPayment() {
    const dialogRef = this.dialog.open(PaymentComponent);
  }
}