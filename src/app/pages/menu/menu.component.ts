import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/interfaces/item.interface';
import { Category } from 'src/app/interfaces/category.interface';
import { ItemsService } from 'src/app/services/items/items.service';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	items: Item[] = [];
	categories: Category[] = [];

	constructor(private route: ActivatedRoute,
	            private itemsService: ItemsService,
	            private ordersService: OrdersService) {
	}

	ngOnInit(): void {
		this.ordersService.createNewOrder();

		this.route.paramMap.subscribe(params => {
			const categoryID = params?.get('categoryID');
			if (categoryID) {
				this.itemsService.getItemsByCategoryId(+categoryID).subscribe(items => {
					this.items = items;
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
			console.log(this.items);
		});
	}

	addToOrder(item: Item) {
		this.ordersService.currentOrder.addItem(item);

		console.log('this.ordersService.currentOrder', this.ordersService.currentOrder);
	}
}
