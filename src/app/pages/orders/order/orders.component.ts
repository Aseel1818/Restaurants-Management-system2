import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { Item } from 'src/app/interfaces/item.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Table } from 'src/app/interfaces/table.interface';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
	selectedOrderId!: number;
	selectedRow: Order | null = null;

	displayedColumns: string[] = ['select', 'OrderID', 'total', 'details', 'table', 'isPaid', 'pay'];
	orders: Order[] = [];
	statusOptions = ['paid', 'not paid'];
	//ordertype: 'paid' | 'not paid'
	allSelected: any;

	selectedItems: Item[] = [];
	isSelectingItems: boolean = false; 
	@ViewChild(MatCheckbox) checkbox!: MatCheckbox;
	selection = new SelectionModel<any>(true, []);

	showCheckboxes = false;

	selectedOrders: any[] = [];
 
	selectedOrdersTotal: number = 0;
	tables: Table[] = [];
	selectedTable!: number;
	ordersDataSource!: MatTableDataSource<Order>;

	constructor(private orderService: OrdersService) { }

	ngOnInit(): void {
		this.orders = this.orderService.getAll()
		console.log(this.orders);
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
	selectAll() {
		for (const order of this.orders) {
			order.isSelected = this.allSelected;
		}
	}


	showNewButton = false;

	buttons = [{ label: 'Join Order', action: 'join' }, { label: 'Split Order', action: 'split' }, { label: 'Edit Order', action: 'edit' }];

	handleAction(action: string) {
		switch (action) {
			case 'join':
				this.paidOrders('notPaid');
				this.joinSelectedOrders();
				break;
			case 'split':
				this.splitOrders();
				break;
			case 'edit':
				this.editOrder();
				break;
			default:
				console.log('Invalid action');
				break;
		}
	}
	joinSelectedOrders() {
		this.showNewButton = true;
		this.showCheckboxes = true;
		/////
		
	}

	doJoin() {
		const selectedOrders = this.selection.selected;
	
		if (selectedOrders.length < 2) {
			Swal.fire("Note !","select 2 items or more to join orders","error");
			return;
		}
		this.orderService.createNewOrder();
		const newOrder = this.orderService.currentOrder;
		this.orderService.add(newOrder);
		this.orders = this.orderService.getAll();
		this.selectedOrders = selectedOrders;
	
		Swal.fire("Done ..!","the item u select was joined","success");
	
		// Join the notes of the selected orders
		let selectedOrdersNotes = '';
	
		for (let order of this.selectedOrders) {
			if (order.notes) {
				if (selectedOrdersNotes === '') {
					selectedOrdersNotes = order.notes;
				} else {
					selectedOrdersNotes += ', ' + order.notes;
				}
			}
		}
	
		let lastOrder = this.orders[this.orders.length - 1];
		for (let i = 0; i < this.selectedOrders.length; i++) {
			const order = this.selectedOrders[i];
			for (let orderDetail of order.orderDetails) {
				let foundItem = lastOrder.orderDetails.find(od => od.item === orderDetail.item);
				if (foundItem) {
					foundItem.quantity += orderDetail.quantity;
				} else {
					lastOrder.orderDetails.push(orderDetail);
				}
			}
			
		}
		
	
		lastOrder.notes = selectedOrdersNotes;
		lastOrder.total = this.selectedOrders.reduce((total, order) => total + order.total, lastOrder.total);
	
		localStorage.setItem('orders', JSON.stringify(this.orders));
	
		this.ordersDataSource.data = this.orders.slice();
	
		this.selection.clear();
	}
	
	  

	splitOrders() {
		//this.showNewButton = false;

	}
	editOrder() {
		//this.showNewButton = false;

	}


	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.orders.forEach(row => this.selection.select(row));
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.orders.length;
		return numSelected === numRows;
	}


}