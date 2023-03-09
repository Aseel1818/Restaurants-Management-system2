import { OrderDetail } from '../interfaces/orderDetail.interface';
import { Table } from '../interfaces/table.interface';
import { Item } from '../interfaces/item.interface';

export class Order {
	id!: number;
	total: number = 0;
	subTotal!: number;
	notes!: string;
	table!: Table;
	orderDetails: OrderDetail[] = [];

	addItem(item: Item) {
		const index = this.orderDetails.findIndex(itemObj => itemObj.item.id === item.id);

		//	if index !== -1 => the item is already exists
		if (index !== -1) {
			this.orderDetails[index].quantity++;
		} else {
			this.orderDetails.push({
				item,
				quantity: 1
			});
		}

		this.total = 0;
		this.orderDetails.forEach(orderDetail => {
			this.total += (orderDetail.item.price * orderDetail.quantity);
		});
	}
}
