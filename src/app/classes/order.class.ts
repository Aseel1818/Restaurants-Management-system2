import { OrderDetail } from '../interfaces/orderDetail.interface';
import { Item } from '../interfaces/item.interface';

export class Order {
	id!: number;
	total: number = 0;
	subTotal!: number;
	notes!: string | null;
	orderDetail: OrderDetail[] = [];
	tableID!: number | null;
	isSelected!: boolean ;
	userName!: string ;
	

	addItem(item: Item) {
		const index = this.orderDetail.findIndex(itemObj => itemObj.item.id === item.id);
		if (index !== -1) {
			this.orderDetail[index].quantity++;
		} else {
			this.orderDetail.push({
				item,
				quantity: 1,
				isChecked: false,
				isPaid: false
			});
		}
		this.updateTotal();
	}

	removeItem(item: Item) {
		const index = this.orderDetail.findIndex((detail: any) => detail.item.id === item.id);
		if (index > -1) {
			if (this.orderDetail[index].quantity > 1) {
				this.orderDetail[index].quantity--;
			} else {
				this.orderDetail.splice(index, 1);
			}
		}
		this.updateTotal();
	}

	updateTotal() {
		this.total = 0;
		this.orderDetail.forEach(orderDetail => {
			this.total += (orderDetail.item.price * orderDetail.quantity);
		});
	}
}