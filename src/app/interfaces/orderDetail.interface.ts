import { Item } from './item.interface';

export interface OrderDetail {
	[x: string]: any;
	item: Item;
	quantity: number;
	isChecked: boolean;
	isPaid: boolean;
}