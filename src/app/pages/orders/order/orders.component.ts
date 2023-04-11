import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/classes/order.class';
import { Item } from 'src/app/interfaces/item.interface';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
	selectedOrderId!: number;
	selectedRow: Order | null = null;

	displayedColumns: string[] = ['select','OrderID', 'total', 'details', 'table', 'isPaid', 'pay'];
	orders: Order[] = [];
	statusOptions = ['paid', 'not paid'];
	allSelected: any;

	selectedItems: Item[] = [];
	isSelectingItems: boolean = false; 
	@ViewChild(MatCheckbox) checkbox!: MatCheckbox ;
	selection = new SelectionModel<any>(true, []);
	

	showCheckboxes = false;
 
	selectedOrders: any[] = [];

	selectedOrdersTotal: number = 0;
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
	
	  /* */
	  showNewButton = false;


	  joinSelectedOrders(){
		this.showNewButton = true;

		this.showCheckboxes = true;
		const selectedOrders = this.selection.selected;
		console.log(selectedOrders)  ; 
		

		
	  }

	  
	  doJoin(){
		
		const selectedOrders = this.selection.selected;
		if (selectedOrders.length >=2 ) {
			// Do something with the selected orders
			this.selectedOrders = selectedOrders;
		  } else {
			// Show a message indicating that no orders were selected
		  }
		  console.log(selectedOrders);
		  //join the notes of the selected orders
		  let selectedOrdersNotes = '';
		  for (let order of this.selectedOrders) {
			//selectedOrdersTotal += order.total;
			if (order.notes) {
				if (selectedOrdersNotes === '') {
					selectedOrdersNotes = order.notes;
				} else {
					selectedOrdersNotes += ', ' + order.notes;
				}
			}
		}
		
		  if (this.selectedOrders.length > 0) {
			let firstOrder = this.selectedOrders[0];
		
			// Check if any of the selected items are already present in the first order
			for (let i = 1; i < this.selectedOrders.length; i++) {
			  const order = this.selectedOrders[i];
			  for (let orderDetail of order.orderDetails) {
				let foundItem = firstOrder.orderDetails.find((od: { itemId: any; }) => od.itemId === orderDetail.itemId);
				if (foundItem) {
				  // If the item is already present in the first order, update its quantity
				  foundItem.quantity += orderDetail.quantity;
				} else {
				  // If the item is not present, add it to the first order
				  firstOrder.orderDetails.push(orderDetail);
				}
			  }
			  //Remove the merged order from the orders array
				this.orders.splice(this.orders.indexOf(order), 1);

				// Append notes of the other orders to the first order's notes
				if (order.notes) {
					if (firstOrder.notes === null) {
						firstOrder.notes = '';
					}
					firstOrder.notes += ', ' + order.notes;
				}
			}
		
			// Update the total and notes of the first order with the selected orders total and notes
			firstOrder.notes = selectedOrdersNotes;
		  }
		
		// Update local storage
		localStorage.setItem('orders', JSON.stringify(this.orders));
		  // Get the first selected order
		  const firstOrder = selectedOrders[0];
		
		  // Loop through the remaining selected orders
		  for (let i = 1; i < selectedOrders.length; i++) {
			const order = selectedOrders[i];
		
			// Add the order details to the first selected order
			firstOrder.orderDetails.push(...order.orderDetails);
		
			// Update the total of the first selected order
			firstOrder.total += order.total;
		  }
   
		  // Clear the selection and update the orders data source
		  this.selection.clear();
		  this.ordersDataSource.data = this.orders.slice();
		  this.selection.clear();
	  }




	  splitOrders(){
		this.showNewButton = false;

	  }
	  editOrder(){
		this.showNewButton = false;

	  }

	  joinSelectedOrderss() {
		const selectedOrders = this.selection.selected;
		this.showCheckboxes = true;

		if (selectedOrders.length >=2 ) {
		  // Do something with the selected orders
		  this.selectedOrders = selectedOrders;
		} else {
		  // Show a message indicating that no orders were selected
		}
		console.log(selectedOrders);
	  
		// Calculate the total of the selected orders
		let selectedOrdersTotal = 0;
		for (let order of this.selectedOrders) {
		  selectedOrdersTotal += order.total;
		}
	  
		if (this.selectedOrders.length > 0) {
		  let firstOrder = this.selectedOrders[0];
	  
		  // Check if any of the selected items are already present in the first order
		  for (let i = 1; i < this.selectedOrders.length; i++) {
			const order = this.selectedOrders[i];
			for (let orderDetail of order.orderDetails) {
			  let foundItem = firstOrder.orderDetails.find((od: { itemId: any; }) => od.itemId === orderDetail.itemId);
			  if (foundItem) {
				// If the item is already present in the first order, update its quantity
				foundItem.quantity += orderDetail.quantity;
			  } else {
				// If the item is not present, add it to the first order
				firstOrder.orderDetails.push(orderDetail);
			  }
			}
		  }
	  
		  // Update the total of the first order with the selected orders total
		  firstOrder.total += selectedOrdersTotal;
		}
	  
	  
		// Get the first selected order
		const firstOrder = selectedOrders[0];
	  
		// Loop through the remaining selected orders
		for (let i = 1; i < selectedOrders.length; i++) {
		  const order = selectedOrders[i];
	  
		  // Add the order details to the first selected order
		  firstOrder.orderDetails.push(...order.orderDetails);
	  
		  // Update the total of the first selected order
		  firstOrder.total += order.total;
		}
 
		// Clear the selection and update the orders data source
		this.selection.clear();
		this.ordersDataSource.data = this.orders.slice();
		this.selection.clear();
	  }
	  
	

	 
	  

	onRowClicked(row: Order ){
		console.log(row) ; 
		this.selectedRow =row ; 

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
