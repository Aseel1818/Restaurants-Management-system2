import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { Item } from 'src/app/interfaces/item.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Table } from 'src/app/interfaces/table.interface';
import { TablesService } from 'src/app/services/tables/tables.service';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
	allSelected: any;
	selectedItems: Item[] = [];
	isSelectingItems: boolean = false;
	@ViewChild(MatCheckbox) checkbox!: MatCheckbox;
	selection = new SelectionModel<any>(true, []);
	showCheckboxes = false;
	selectedOrders: any[] = [];
	selectedOrdersTotal: number = 0;
	tables: Table[] = [];
	tableId: Table | null = null;
	selectedTable!: number;
	selectedItemsDetails: OrderDetail[] = [];

	constructor(private orderService: OrdersService,
		private tableService: TablesService,
		 private router: Router,
		 private toastr: ToastrService
		 ) { }

	ngOnInit(): void {
		this.orders = this.orderService.getAll()
		console.log(this.orders);

		this.orders.forEach(order => {
			this.orderService.deleteOrder(order);
		})

		this.tableService.getAll()
			.subscribe((tables: Table[]) => {
				this.tables = tables.filter(t => t.status === false);
			});

		this.orders = this.orders.filter(order => order.orderDetails.length > 0);
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

	buttons = [{ label: 'Join Order', action: 'join' }];

	handleAction(action: string) {
		switch (action) {
			case 'join':
				this.paidOrders('notPaid');
				this.joinSelectedOrders();
				break;
			case 'split':
				break;
			case 'edit':
				break;
			default:
				console.log('Invalid action');
				break;
		}
	}

	joinSelectedOrders() {
		this.showNewButton = true;
		this.showCheckboxes = true;
	}

	joinOrders(selectedTable: number | null = null) {
		const selectedOrders = this.selection.selected;

		if (selectedOrders.length < 2) {
			this.toastr.error("select 2 items or more to join orders","Note !")
			return;
		}

		this.orderService.createNewOrder();
		const newOrder = this.orderService.currentOrder!;
		newOrder.tableID = selectedTable;

		this.orderService.add(newOrder);
		this.orders = this.orderService.getAll();
		this.orders = this.orders.filter(order => !selectedOrders.includes(order));
		this.selectedOrders = selectedOrders;
		this.selectedItemsDetails = [];
		let selectedOrdersNotes = "";
		for (let order of this.selectedOrders) {
			if (order.notes) {
				if (selectedOrdersNotes === "") {
					selectedOrdersNotes = order.notes;
				} else {
					selectedOrdersNotes += ", " + order.notes;
				}
			}
			this.selectedItemsDetails.push(...order.orderDetails);
		}

		let lastOrder = this.orders[this.orders.length - 1];

		for (let orderDetail of this.selectedItemsDetails) {
			let foundItem = lastOrder.orderDetails.find(
				od => od.item.name === orderDetail.item.name
			);
			if (foundItem) {
				foundItem.quantity += orderDetail.quantity;
			} else {
				lastOrder.orderDetails.push(orderDetail);
			}
		}
		lastOrder.notes = selectedOrdersNotes;
		lastOrder.total = this.selectedOrders.reduce((total, order) => total + order.total, lastOrder.total);
		localStorage.setItem('orders', JSON.stringify(this.orders));
		this.selection.clear();
		this.toastr.success("the item u select was joined","Done ..!")
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

	editOrder(order: Order): void {
		this.orderService.editOrder(order);
	}

	goToSplitOrder(orderID: number) {
		this.selectedOrderId = orderID;
		this.router.navigate(['/split'], { queryParams: { orderId: this.selectedOrderId } });
	}
}