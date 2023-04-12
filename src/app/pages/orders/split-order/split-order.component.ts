import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Order } from 'src/app/classes/order.class';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-split-order',
  templateUrl: './split-order.component.html',
  styleUrls: ['./split-order.component.css']
})
export class SplitOrderComponent implements DoCheck, OnInit {
  @Input() id !: number;
  splitsNumber!: number;
  num!: number;
  order!: Order | null;
  orders: Order[] = [];
  tempOrders: Order[] = [];
  numbers: Array<number> = [];
  tempArr: Array<number> = [];
  showSplitAlert = false;
  length: number = 0;
  selectedItem = '';


  constructor(public dialogRef: MatDialogRef<SplitOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private orderService: OrdersService) { }

  ngOnInit() {
    this.id = this.data.id;
    this.orders = this.orderService.getAll();


  }


  ngDoCheck(): void {
    this.order = this.orderService.getOrderByID(this.id);

  }


  split() {

    this.order?.orderDetails.forEach(orderDetail => {
      this.length += orderDetail.quantity;
    })

    if (this.splitsNumber <= this.length) {
      this.showSplitAlert = false;
      for (let i = 1; i <= this.orders.length; i++) {

        this.tempArr.push(i);

      }

      this.numbers.push(this.id);

      for (let i = 0; i < this.splitsNumber; i++) {
        this.num = this.tempArr[this.tempArr.length - 1] + i;
        if (!this.numbers.includes(this.num) && !this.tempArr.includes(this.num)) {
          this.numbers.push(this.num);
          this.tempArr.push(this.num);

        }
      }
      this.length = 0;

    }

    else {
      this.showSplitAlert = true;
      this.numbers.length = 0;
    }

  }

  close(): void {
    this.dialogRef.close();
}

createNewOrders() {
  // Create a map to group order details by selected number
  const orderDetailsMap = new Map<number, OrderDetail[]>();
  this.order?.orderDetails.forEach((orderDetail) => {
    const selectedNumber = orderDetail.selectedNumber;
    if (selectedNumber) {
      let orderDetails = orderDetailsMap.get(selectedNumber);
      if (!orderDetails) {
        orderDetails = [];
        
        orderDetailsMap.set(selectedNumber, orderDetails);
      }
      orderDetails.push(orderDetail);
    }
  });

  // Create a new order object for each selected number
  orderDetailsMap.forEach((orderDetails, selectedNumber) => {
    const newOrder = new Order();
    newOrder.id = selectedNumber;

    newOrder.orderDetails = orderDetails;

    this.orderService.deleteOrderById(this.orders,this.order!.id);
    
    this.orders.push(newOrder);

   this.orderService.add(newOrder);

    console.log(this.orders);
  });
}


}