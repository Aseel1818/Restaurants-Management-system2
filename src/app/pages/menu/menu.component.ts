import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Item } from "src/app/interfaces/item.interface";
import { Category } from "src/app/interfaces/category.interface";
import { ItemsService } from "src/app/services/items/items.service";
import { OrdersService } from "../../services/orders/orders.service";
import { Order } from "src/app/classes/order.class";
import { TablesService } from "src/app/services/tables/tables.service";
import { Table } from "src/app/interfaces/table.interface";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
	items: Item[] = [];
	categories: Category[] = [];
	filteredItems: Item[] = [];
	searchQuery = "";
	selectedItems: Item[] = [];
	order!: Order;
	tables: Table[] = [];
	selectedTable!: number;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private itemsService: ItemsService,
		private ordersService: OrdersService,
		private tableService: TablesService
	) { }

	ngOnInit(): void {
		this.order = new Order();

		if (this.ordersService.currentOrder) {
			Object.assign(this.order, this.ordersService.currentOrder);
			this.selectedTable = this.order.tableID!;
		}

		this.route.paramMap.subscribe((params) => {
			const categoryID = params?.get("categoryID");
			if (categoryID) {
				this.itemsService
					.getItemsByCategoryId(+categoryID)
					.subscribe((items) => {
						this.filteredItems = items;
					});
			} else {
				this.getAllItems();
			}
		});

		this.itemsService.getAllCategories().subscribe((categories) => {
			this.categories = categories;
		});

		this.tableService.getAll().subscribe((tables: Table[]) => {
			this.tables = tables.filter((t) => t.status === false);
		});
	}

	getAllItems() {
		this.itemsService.getAllItems().subscribe(items => {
			this.items = items;
			this.filteredItems = items;
		});
	}

	addToOrder(item: Item) {
		this.order.addItem(item);
	}

	filterItems() {
		if (this.searchQuery.trim() !== "") {
			this.filteredItems = this.items.filter((item) => {
				return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
			});
		} else {
			this.filteredItems = this.items;
		}
	}

	addSelectedItemsToOrder(tableID: number) {
		const tableIDs: number[] = [];
		if (tableID) {
			tableIDs.push(tableID);
			console.log(this.order.tableID);
		}
		if (this.order.tableID) {
			tableIDs.push(this.order.tableID!);
		}
		this.order.tableID = tableID!;
		this.tableService.updateTable(tableIDs).subscribe(table => {
			console.log("updated table" + this.order.tableID);
		});
		this.ordersService.add(this.order);
		this.router.navigate(["/orders"]);
	}

	removeItem(item: Item) {
		this.order.removeItem(item);
	}

	get buttonText() {
		return this.order.id ? 'UPDATE' : 'ORDER';
	}

	ngOnDestroy(): void {
		this.ordersService.currentOrder = null;
	}
}