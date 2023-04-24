import { OrderDetail } from '../interfaces/orderDetail.interface';
import { Item } from '../interfaces/item.interface';

export class Order {
	id!: number;
	total: number = 0;
	subTotal!: number;
	subTotals:number=0;
	notes!: string | null ;
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
		this.total = 0;
		this.orderDetails.forEach(orderDetail => {
			this.total += (orderDetail.item.price * orderDetail.quantity);
		});
	}

	updateTotal() {
		this.total = 0;
		this.orderDetails.forEach(orderDetail => {
			this.total += (orderDetail.item.price * orderDetail.quantity);
		});
	}
}
