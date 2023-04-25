import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AuthGuard } from './guard/auth.guard';
import { SplitOrderComponent } from './pages/orders/split-order/split-order.component';

const routes: Routes = [
	{
		path: '',
		component: MenuComponent,
		canActivate: [AuthGuard],
		pathMatch: 'full',
	},

	{
		path: 'login',
		component: LoginComponent,

	},
	{
		path: 'categories/:categoryID',
		component: MenuComponent,
		canActivate: [AuthGuard]

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
		redirectTo: '/',
	},
	
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
