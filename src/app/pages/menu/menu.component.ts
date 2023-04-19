import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item.interface';
import { Category } from 'src/app/interfaces/category.interface';
import { ItemsService } from 'src/app/services/items/items.service';
import { OrdersService } from '../../services/orders/orders.service';
import { Order } from 'src/app/classes/order.class';
import { TablesService } from 'src/app/services/tables/tables.service';
import { Table } from 'src/app/interfaces/table.interface';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	items: Item[] = [];
	categories: Category[] = [];
	filteredItems: Item[] = [];
	searchQuery = '';
	selectedItems: Item[] = [];
	order!: Order;
	tables: Table[] = [];
	selectedTable!: number;
	note: string = '';
	@Input() id: number = 0;

	private orderSubscription: Subscription = new Subscription();

	constructor(private route: ActivatedRoute,
		private router: Router,
		private itemsService: ItemsService,
		private ordersService: OrdersService,
		private tableService: TablesService) {
	}

	ngOnInit(): void {
		this.orderSubscription = this.ordersService.getOrderObservable().subscribe((order: Order) => {
			this.order = order;
			this.note = order.notes || '';
		});

		this.route.paramMap.subscribe(params => {
			const categoryID = params?.get('categoryID');
			if (categoryID) {
				this.itemsService.getItemsByCategoryId(+categoryID).subscribe(items => {
					this.filteredItems = items;
				});
			} else {
				this.getAllItems();
			}
		});

		this.itemsService.getAllCategories().subscribe(categories => {
			this.categories = categories;
		});


		this.tableService.getAll()
			.subscribe((tables: Table[]) => {
				this.tables = tables.filter(t => t.status === false);
			});
	}

	getAllItems() {
		this.itemsService.getAllItems().subscribe(items => {
			this.items = items;
			this.filteredItems = items;
		});
	}

	addToOrder(item: Item) {
		const orderItem = this.order.orderDetails.find((oi: any) => oi.item.id === item.id);
		if (orderItem) {
			orderItem.quantity++;

		} else {
			this.order.orderDetails.push({
				item, quantity: 1,
				isChecked: false,
				isPaid: false
			});
		}
		this.order.total = this.order.orderDetails.reduce((total: number, detail: any) => {
			return total + detail.item.price * detail.quantity;
		}, 0);
	}

	filterItems() {
		if (this.searchQuery.trim() !== '') {
			this.filteredItems = this.items.filter(item => {
				return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
			});
		} else {
			this.filteredItems = this.items;
		}
	}

	addSelectedItemsToOrder(tableID: number, note: string) {
		const tableToUpdate = this.tables.find(table => table.id === tableID);
		console.log(tableToUpdate)
		this.order.notes = note;
		if (tableToUpdate) {
			this.order.tableID = tableID;
			this.tableService.updateTable(tableToUpdate).subscribe(
				updatedTable => {
					tableToUpdate.status = updatedTable.status;
					this.ordersService.add(this.order);
					console.log(tableToUpdate)
					this.router.navigate(['/orders']);
				},
				error => console.error(error)
			);
		} else {
			this.order.notes = note;
			this.ordersService.add(this.order);
			console.log(this.order.notes)
			this.router.navigate(['/orders']);
		}
	}


	deleteItem(item: any) {
		const index = this.order.orderDetails.findIndex((detail: any) => detail.item.id === item.item.id);
		if (index > -1) {
			if (this.order.orderDetails[index].quantity > 1) {
				this.order.orderDetails[index].quantity--;
			} else {
				this.order.orderDetails.splice(index, 1);
			}
			this.order.total = this.order.orderDetails.reduce((total: number, detail: any) => {
				return total + detail.item.price * detail.quantity;
			},
				0);
		}
	}
}