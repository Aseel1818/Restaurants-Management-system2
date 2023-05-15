import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  barChartDataDaily = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        label: 'Sales perc',
        backgroundColor: 'rgb(255, 99, 132)',
      }
    ]
  };
  dailyOrdersData: number[] = []; // New property to hold the data for daily orders

  constructor(private http: HttpClient) {
    //const roles = JSON.parse(localStorage.getItem('roles')!);
    this.fetchDailyOrders();
  }

  fetchDailyOrders() {
    this.http.get<number[]>('/rest/order/dailyOrders').subscribe(data => {
      this.dailyOrdersData = data;
      this.updateBarChartDataDaily();
    });
  }

  updateBarChartDataDaily() {
    this.barChartDataDaily.datasets[0].data = this.dailyOrdersData;
  }
}
