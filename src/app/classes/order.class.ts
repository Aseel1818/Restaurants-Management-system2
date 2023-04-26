import { OrderDetail } from '../interfaces/orderDetail.interface';
import { Item } from '../interfaces/item.interface';

export class Order {
	id!: number;
	total: number = 0;
	subTotal!: number;
	notes!: string | null;
	orderDetails: OrderDetail[] = [];
	tableID!: number | null;

	addItem(item: Item) {
		const index = this.orderDetails.findIndex(itemObj => itemObj.item.id === item.id);
		if (index !== -1) {
			this.orderDetails[index].quantity++;
		} else {
			this.orderDetails.push({
				item,
				quantity: 1,
				isChecked: false,
				isPaid: false
			});
		}
		this.updateTotal();
	}

	removeItem(item: Item) {
		const index = this.orderDetails.findIndex((detail: any) => detail.item.id === item.id);
		if (index > -1) {
			if (this.orderDetails[index].quantity > 1) {
				this.orderDetails[index].quantity--;
			} else {
				this.orderDetails.splice(index, 1);
			}
		}
		this.updateTotal();
	}

	updateTotal() {
		this.total = 0;
		this.orderDetails.forEach(orderDetail => {
			this.total += (orderDetail.item.price * orderDetail.quantity);
		});
	}
}
