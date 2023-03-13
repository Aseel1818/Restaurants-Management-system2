import { Injectable } from '@angular/core';
import { Item } from 'src/app/interfaces/item.interface';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { Order } from 'src/app/classes/order.class';
@Injectable({
  providedIn: 'root'
})
export class ItemsSelectionService {
  selectedItems: OrderDetail[] = [];
  currentOrder: Order = new Order();
  constructor() { }
  addItem(item: Item) {
    const index = this.selectedItems.findIndex(itemObj => itemObj.item.id === item.id);
    // if index !== -1 => the item is already exists
    if (index !== -1) {
      this.selectedItems[index].quantity++;
    } else {
      this.selectedItems.push({
        item,
        quantity: 1
      });
    }
  }
  removeItem(item: Item) {
    const index = this.selectedItems.findIndex(itemObj => itemObj.item.id === item.id);
    if (index !== -1) {
      const orderDetail = this.selectedItems[index];
      if (orderDetail.quantity > 1) {
        orderDetail.quantity--;
      } else {
        this.selectedItems.splice(index, 1);
      }
    }
  }
  clearSelection() {
    this.selectedItems = [];
  }
  setOrder(order: Order) {
    this.currentOrder = order;
  }
  getOrder(): Order {
    return this.currentOrder;
  }
}