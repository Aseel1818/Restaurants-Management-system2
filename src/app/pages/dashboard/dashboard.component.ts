import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/classes/order.class';
import { OrderDetail } from 'src/app/interfaces/orderDetail.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  barChartDataDaily = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Sales perc',
        backgroundColor: 'rgb(255, 99, 132)',
      }
    ]
  };

  barChartDataMonthly = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Sales perc',
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ]
  };

  barChartUserSales = {
    labels: ['Isra', 'Noor', 'Aseel', 'Sana'],
    datasets: [
      {
        data: [5, 10, 20, 1],
        label: 'best items Sales perc',
        backgroundColor: ['rgb(255, 99, 132)']
      }
    ]
  } 

  pieChartData = {
    labels: [""],
    datasets: [
      {
        data: [0],
        label: 'best items Sales perc',
        backgroundColor: ['rgb(255, 99, 132)']
      }
    ]
  };

  dailyOrdersData: number[] = [];
  weeklyOrdersData: number[] = [];
  monthlyOrdersData: number[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const orders = this.route.snapshot.data['orders'];

    if (orders) {
      this.dailyOrdersData = this.calculateDailyOrders(orders);
      this.monthlyOrdersData = this.calculateMonthlyOrders(orders);

      this.updateBarChartDataDaily();
      this.updateBarChartDataMonthly();
      this.calculateFreqSelling(orders);
    }
  }

  calculateDailyOrders(orders: any[]): number[] {
    const dailyOrders: number[] = [0, 0, 0, 0, 0, 0, 0];
    orders.forEach(order => {
      const paymentDate = new Date(order.payment_date);
      const dayOfWeek = paymentDate.getDay();
      dailyOrders[dayOfWeek]++;
    });

    return dailyOrders;
  }

  calculateMonthlyOrders(orders: any[]): number[] {
    const monthlyOrders: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    orders.forEach(order => {
      const paymentDate = new Date(order.payment_date);
      const month = paymentDate.getMonth();
      monthlyOrders[month]++;
    });

    return monthlyOrders;
  }

  calculateFreqSelling(orders: Order[]): void {
    const itemQuantities: { [itemId: string]: { label: string, quantity: number } } = {};
    let totalQuantity = 0;

    orders.forEach((order: Order) => {
      order.orderDetail.forEach((orderDetail: OrderDetail) => {
        const { id, name } = orderDetail.item;
        const quantity = orderDetail.quantity;

        if (!itemQuantities[id]) {
          itemQuantities[id] = { label: name, quantity: 0 };
        }

        itemQuantities[id].quantity += quantity;
        totalQuantity += quantity;
      });
    });

    const sortedItems = Object.entries(itemQuantities).sort((a, b) => b[1].quantity - a[1].quantity);
    const limitedItems = sortedItems.slice(0, 5);

    const { datasets } = this.pieChartData;
    datasets[0].data = [];
    datasets[0].backgroundColor = [];
    this.pieChartData.labels = [];

    limitedItems.forEach(([id, itemData]) => {
      const { label, quantity } = itemData;
      const percentage = (quantity / totalQuantity) * 100;
      datasets[0].data.push(percentage);

      const randomColor = `rgb(${this.getRandomValue()}, ${this.getRandomValue()}, ${this.getRandomValue()})`;
      datasets[0].backgroundColor.push(randomColor);
      this.pieChartData.labels.push(label);
    });
  }

  getRandomValue(): number {
    return Math.floor(Math.random() * 256);
  }

  updateBarChartDataDaily() {
    this.barChartDataDaily.datasets[0].data = this.dailyOrdersData;
  }

  updateBarChartDataMonthly() {
    this.barChartDataMonthly.datasets[0].data = this.monthlyOrdersData;
  }
}