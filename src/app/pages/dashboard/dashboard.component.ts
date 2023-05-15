import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  barChartDataWeekly = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Sales perc',
        backgroundColor: 'rgb(54, 162, 235)',
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

  dailyOrdersData: number[] = [];
  weeklyOrdersData: number[] = [];
  monthlyOrdersData: number[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const orders = this.route.snapshot.data['orders'];
    console.log('Orders:', orders);

    this.dailyOrdersData = this.calculateDailyOrders(orders);
    this.weeklyOrdersData = this.calculateWeeklyOrders(orders);
    this.monthlyOrdersData = this.calculateMonthlyOrders(orders);

    this.updateBarChartDataDaily();
    this.updateBarChartDataWeekly();
    this.updateBarChartDataMonthly();
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

  calculateWeeklyOrders(orders: any[]): number[] {
    const weeklyOrders: number[] = [0, 0, 0, 0];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
  
    orders.forEach(order => {
      const paymentDate = new Date(order.payment_date);
      const orderMonth = paymentDate.getMonth();
  
      if (orderMonth === currentMonth) {
        const weekNumber = Math.floor((paymentDate.getDate() - 1) / 7);
        weeklyOrders[weekNumber]++;
      }
    });
  
    return weeklyOrders;
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

  updateBarChartDataDaily() {
    this.barChartDataDaily.datasets[0].data = this.dailyOrdersData;
  }

  updateBarChartDataWeekly() {
    this.barChartDataWeekly.datasets[0].data = this.weeklyOrdersData;
  }

  updateBarChartDataMonthly() {
    this.barChartDataMonthly.datasets[0].data = this.monthlyOrdersData;
  }
}
