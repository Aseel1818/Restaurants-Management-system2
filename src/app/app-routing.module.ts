import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/menu',
		pathMatch: 'full',
	},

	{
		path: 'login',
		component: LoginComponent,

	},
	{
		path: 'menu',
		component: MenuComponent,
		canActivate: [AuthGuard]
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
		path: '**',
		redirectTo:'/menu',
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
