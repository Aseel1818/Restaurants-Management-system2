import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/classes/order.class';
import { Item } from 'src/app/interfaces/item.interface';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-split-order',
  templateUrl: './split-order.component.html',
  styleUrls: ['./split-order.component.css']
})
export class SplitOrderComponent implements OnInit {
  @Input() id: number = 0;
  order!: Order | null;
  currentOrder: OrderDetail[] = [];
  ordersLists: OrderDetail[][] = [];
  orders: Order[] = [];
  numberOfLists: number = 0;
  total: number = 0;
  lastOrderID: number = 0;
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) { }
  ngOnInit(): void {
    this.orders = this.orderService.getAll();
    this.route.queryParams.subscribe((params) => {
      this.id = params["orderId"];
    }
    );
    console.log(this.id)
    this.order = this.orderService.getOrderByID(this.id);
    if (this.order) {
      this.currentOrder = this.order.orderDetails;
    }
    this.lastOrderID = this.orders.length;
  }
  updateCurrentOrderToatal() {
    let total = 0;
    this.currentOrder.forEach(orderDetail => { total += orderDetail.quantity * orderDetail.item.price });
    if (this.order?.total !== undefined) {
      this.order.total = total;
      this.orderService.add(this.order);
    }
  }
  showToast() {
    for (let i = 0; i < this.ordersLists.length; i++) {
      let orderDetails = this.ordersLists[i];
      this.total = 0;
      if (orderDetails.length > 0) {
        orderDetails.forEach(orderDetail => {
          this.total +=
            orderDetail.quantity * orderDetail.item.price;
        }
        )
        let order: Order = {
          orderDetails,
          total: this.total,
          id: this.orders.length + 1,
          tableID: 3,
          subTotal: 0,
          notes: '',
          addItem: function (item: Item): void {
            throw new Error('Function not implemented.');
          },
          removeItem: function (item: Item): void {
            throw new Error('Function not implemented.');
          },
          updateTotal: function (): void {
            throw new Error('Function not implemented.');
          },
          name: function (name: any): void {
            throw new Error('Function not implemented.');
          },
          isSelected: false
        };
        this.orders.push(order);
        this.orderService.add(order);
      }
    }
    this.updateCurrentOrderToatal();
    this.toaster.showToaster("Successful", "Your split done successfully", 'success');
  }
  createLists() {
    if (this.numberOfLists >= 1 && this.numberOfLists <= 4) {
      this.ordersLists = Array.from({ length: this.numberOfLists }, () => []);
    } else {
      this.toaster.showToaster("warning", "invalid orders number", 'error');
    }
  }
  splitListsDrop(event: CdkDragDrop<OrderDetail[]>, listIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.ordersLists[listIndex],
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  currentOrderDrop(event: CdkDragDrop<OrderDetail[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}