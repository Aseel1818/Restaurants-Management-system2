import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

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
  numberOfLists: number = 0;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params["orderId"];
    });
    this.order = this.orderService.getOrderByID(this.id);

    if (this.order) {
      this.currentOrder = this.order.orderDetails;
    }

    this.createLists();
  }

  showToast() {
    this.toaster.showToaster("Successfull", "your split done successfully",'success');
  }

  createLists() {
    this.ordersLists = Array.from({ length: this.numberOfLists }, () => []);
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