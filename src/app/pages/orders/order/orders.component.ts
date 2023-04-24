import { Component, DoCheck, Inject, Injectable, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SplitOrderComponent } from '../split-order/split-order.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})



export class OrdersComponent implements OnInit, DoCheck {

	selectedOrderId!: number;
	selectedOrderId2!: number;
	displayedColumns: string[] = ['OrderID', 'total', 'details', 'table', 'isPaid', 'pay'];
	orders: Order[] = [];
	statusOptions = ['paid', 'not paid'];
	showSplit = true;

	constructor(private orderService: OrdersService, private dialog: MatDialog,private router: Router) { }

	ngOnInit(): void {
		this.orders = this.orderService.getAll()
		console.log(this.orders);
	}

	ngDoCheck(): void {
		this.orders.forEach(order => {
			order.orderDetails.forEach(orderDetail => {
				if (!orderDetail.isPaid === false) {
					this.showSplit = false;
				}
				else {
					this.showSplit = true;
				}

			})
		})
	}

	goToPayments(orderID: number) {
		this.selectedOrderId = orderID

	}

	isOrderPaid(order: Order): boolean {
		return order.orderDetails.every(obj => obj.isPaid === true);
	}

	paidOrders(orderStatus: string) {
		if (orderStatus === "all") {
			this.orders = this.orderService.getAll();
		} else {
			this.orders = this.orderService.getAll().filter(order => {
				if (orderStatus === "paid") {
					return this.isOrderPaid(order);
				} else {

					return !this.isOrderPaid(order);
				}
			});
		}
	}

	goToSplitOrder(orderID: number) {
		this.selectedOrderId = orderID;

		this.router.navigate(['/split'], { queryParams: { orderId: this.selectedOrderId } });
	}
}