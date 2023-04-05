import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full'
	},
	{
		path: 'items',
		component: MenuComponent,
	},
	{
		path: 'menu',
		component: MenuComponent,
	},
	{
		path: 'categories/:categoryID',
		component: MenuComponent,
	},
	{
		path: 'tables',
		loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule),
	},
	{
		path: 'orders',
		loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
