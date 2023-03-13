import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item.interface';
import { Category } from 'src/app/interfaces/category.interface';
import { ItemsService } from 'src/app/services/items/items.service';
import { OrdersService } from '../../services/orders/orders.service';
import { Order } from 'src/app/classes/order.class';
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

	constructor(private route: ActivatedRoute,
		private router: Router,
		private itemsService: ItemsService,
		private ordersService: OrdersService) {
	}

	ngOnInit(): void {
		this.ordersService.createNewOrder();
		this.order = this.ordersService.currentOrder

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
	}

	getAllItems() {
		this.itemsService.getAllItems().subscribe(items => {
			this.items = items;
			this.filteredItems = items;
		});
	}
	addToOrder(item: Item): void {
		this.order.addItem(item);
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

	addSelectedItemsToOrder() {
		this.ordersService.add(this.order)
		this.router.navigate(['/orders'])
	}

}