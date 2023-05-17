import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AuthGuard } from './guard/auth.guard';
import { SplitOrderComponent } from './pages/orders/split-order/split-order.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartDataResolver } from './resolvers/chart-data.resolver';

const routes: Routes = [
	{
		path: '',
		component: MenuComponent,
		canActivate: [AuthGuard],
		pathMatch: 'full',
		resolve: {
			orders: ChartDataResolver,
		}
	},

	{
		path: 'api/auth/signin',
		component: LoginComponent,

	},
	{
		path: 'rest/category/:categoryID',
		component: MenuComponent,
		canActivate: [AuthGuard]

	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		resolve: {
			orders: ChartDataResolver,
		}
	},
	{
		path: 'tables',
		canActivate: [AuthGuard],
		loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule),
	},
	{
		path: 'orders',
		canActivate: [AuthGuard],
		loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
	},
	{
        path: 'split',
        canActivate: [AuthGuard],
        component: SplitOrderComponent
    },
	{
		path: '**',
		redirectTo:'/',
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
