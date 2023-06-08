import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import { Table } from 'src/app/interfaces/table.interface';
@Component({
  selector: 'app-split-order',
  templateUrl: './split-order.component.html',
  styleUrls: ['./split-order.component.css']
})
export class SplitOrderComponent implements OnInit {
  @Input() id: number = 0;
  order!: Order | null;
  newOrder!: Order;
  currentOrder: OrderDetail[] = [];
  ordersLists: OrderDetail[][] = [];
  orders: Order[] = [];
  numberOfLists: number = 0;
  total: number = 0;
  lastOrderID: number = 0;
  tables: Table[] = [];
  selectedTable!: number;
  currentOrderTotal: number = 0;
  totals: number[] = [0];
  selectedTables: number[] = [];
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private tableService: TablesService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.orders = this.orderService.getAll();
    this.route.queryParams.subscribe((params) => {
      this.id = params["orderId"];
    }
    );
    this.order = this.orderService.getOrderByID(this.id);
    if (this.order) {
      this.currentOrder = this.order.orderDetail;
    }
    if (this.orders.length > 0) {
      this.lastOrderID = this.orders[this.orders.length - 1].id;
    }
    this.tableService.getAll().subscribe((tables: Table[]) => {
      this.tables = tables.filter((table) => table.status === false);
    }
    );
    this.currentOrder.forEach(orderDetail => {
      this.currentOrderTotal += orderDetail.item.price * orderDetail.quantity;
    }
    )
  }
  isSplitEmpty(): boolean {
    let listsNumberFlag: boolean;
    if (this.numberOfLists === 0) {
      listsNumberFlag = true;
    }
    else {
      listsNumberFlag = false;
    }
    return listsNumberFlag;
  }
  updateCurrentOrderToatal() {
    if (this.order?.total !== undefined) {
      this.order.total = this.currentOrderTotal;
      this.order.notes=this.order.notes;
      console.log(this.order.tableID);
      this.order.tableID=this.order.tableID;
      this.orderService.add(this.order);
    }
  }
  Split() {
    const tableIDs: number[] = [];
    if (this.selectedTable) {
      tableIDs.push(this.selectedTable);
    }
    if (this.selectedTables) {
      for (let i = 0; i < this.selectedTables.length; i++) {
        tableIDs.push(this.selectedTables[i]);
      }
    }
    this.tableService.updateTable(tableIDs).subscribe(res => {
    }
    );
    for (let i = 0; i < this.ordersLists.length; i++) {
      let orderDetails = this.ordersLists[i];
      if (orderDetails.length > 0) {
        let newOrder: Order = {
          total: this.totals[i],
          id: this.lastOrderID + i + 1,
          tableID: this.selectedTables[i],
          subTotal: 0,
          notes: '',
          addItem: function (): void {
            throw new Error('Function not implemented.');
          },
          removeItem: function (): void {
            throw new Error('Function not implemented.');
          },
          updateTotal: function (): void {
            throw new Error('Function not implemented.');
          },
          isSelected: false,
          orderDetail: orderDetails,
          userName: ''
        };
        this.orders.push(newOrder);
        this.orderService.add(newOrder);
      }
    }
    this.updateCurrentOrderToatal();
    this.toaster.showToaster("Successful", "Your split done successfully", 'success');
    this.router.navigate(['/orders']);
  }
  createLists() {
    if (this.numberOfLists >= 1 && this.numberOfLists <= 4) {
      this.ordersLists = Array.from({ length: this.numberOfLists }, () => []);
    } else {
      this.toaster.showToaster("Warning", "invalid orders number", 'error');
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
      for (let i = 0; i < this.numberOfLists; i++) {
        this.calculateListTotal(i);
      }
      this.calculateTotal();
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
      for (let i = 0; i < this.numberOfLists; i++) {
        this.calculateListTotal(i);
      }
      this.calculateTotal();
    }
  }
  calculateTotal() {
    let total = 0;
    this.currentOrder.forEach(orderDetail => {
      total += orderDetail.item.price * orderDetail.quantity;
    }
    );
    this.currentOrderTotal = total;
  }
  calculateListTotal(index: number) {
    let total = 0;
    this.ordersLists[index].forEach(orderDetail => {
      total += orderDetail.item.price * orderDetail.quantity
    }
    );
    this.totals[index] = total;
  }
}